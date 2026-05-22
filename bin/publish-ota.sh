#!/usr/bin/env bash
set -euo pipefail

# Wrapper around `hot-updater deploy` + post-deploy verification.
#
# `hot-updater deploy` itself reports success the moment uploads + the bundle
# record POST land. That doesn't catch storage-side bugs where the wrong bytes
# end up at the bundle URL (e.g. manifest overwriting bundle — the device then
# rejects with "bundle signature verification failed"). This script re-checks
# the device-facing endpoints from the outside before declaring success, and
# disables the bundle server-side if anything is off so no phone wedges.
#
# Usage:
#   bin/publish-ota.sh "fix: short description"            # targets package.json version, prod channel
#   bin/publish-ota.sh "..." 0.1.x                          # custom semver range
#   CHANNEL=staging bin/publish-ota.sh "..."                # custom channel
#   HOT_UPDATER_BASE_URL=... bin/publish-ota.sh "..."       # override OTA host
#   SKIP_VERIFY=1 bin/publish-ota.sh "..."                  # bypass post-deploy checks

if [ $# -lt 1 ]; then
  echo "usage: $0 \"<message>\" [target-app-version-range]" >&2
  exit 1
fi

MESSAGE="$1"
TARGET="${2:-}"
CHANNEL="${CHANNEL:-production}"
BASE_URL="${HOT_UPDATER_BASE_URL:-https://maya.toshbox.dev}"

cd "$(dirname "$0")/.."  # maya root

# ---------- Deploy ----------

ARGS=(deploy -p ios -c "$CHANNEL" -m "$MESSAGE")
if [ -n "$TARGET" ]; then
  ARGS+=(-t "$TARGET")
fi
npx hot-updater "${ARGS[@]}"

if [ "${SKIP_VERIFY:-0}" = "1" ]; then
  exit 0
fi

# ---------- Verify ----------

echo
echo "→ Verifying deploy against $BASE_URL ..."

jget() { python3 -c "import json,sys; d=json.load(sys.stdin); print(d$1)" 2>/dev/null; }

# Latest bundle for this channel/platform — UUIDv7 is monotonic so the newest
# id is what we just deployed.
LIST=$(curl -fsS "$BASE_URL/hot-updater/api/bundles?platform=ios&channel=$CHANNEL&limit=1")
BUNDLE_ID=$(echo "$LIST" | jget '["data"][0]["id"]')
EXPECTED_BUNDLE_SHA=$(echo "$LIST" | jget '["data"][0]["fileHash"]')
EXPECTED_MANIFEST_SHA=$(echo "$LIST" | jget '["data"][0]["manifestFileHash"]')
STORAGE_URI=$(echo "$LIST" | jget '["data"][0]["storageUri"]')

if [ -z "$BUNDLE_ID" ]; then
  echo "  ✗ Could not read latest bundle from $BASE_URL/hot-updater/api/bundles" >&2
  exit 1
fi

echo "  Bundle:  $BUNDLE_ID"

fail() {
  echo "  ✗ $1" >&2
  echo "  Disabling bundle $BUNDLE_ID server-side so no device tries to install it." >&2
  curl -fsS -X PATCH "$BASE_URL/hot-updater/api/bundles/$BUNDLE_ID" \
    -H 'Content-Type: application/json' -d '{"enabled":false}' >/dev/null || true
  exit 1
}

# (1) Bundle blob: resolve via /getDownloadUrl (what the device does), fetch,
# verify SHA against the registered fileHash. Catches the case where manifest
# overwrites bundle at the same storage key.
BUNDLE_URL=$(curl -fsS -X POST "$BASE_URL/getDownloadUrl" \
  -H 'Content-Type: application/json' \
  -d "{\"storageUri\":\"$STORAGE_URI\"}" | jget '["fileUrl"]')
if [ -z "$BUNDLE_URL" ]; then
  fail "getDownloadUrl returned no fileUrl"
fi
ACTUAL_BUNDLE_SHA=$(curl -fsS "$BUNDLE_URL" | sha256sum | awk '{print $1}')
if [ "$ACTUAL_BUNDLE_SHA" != "$EXPECTED_BUNDLE_SHA" ]; then
  fail "Bundle SHA mismatch — device would fail signature verification
    expected $EXPECTED_BUNDLE_SHA
    actual   $ACTUAL_BUNDLE_SHA"
fi
echo "  ✓ Bundle bytes match fileHash"

# (2) Manifest: read via /readText, verify SHA against manifestFileHash.
if [ -n "$EXPECTED_MANIFEST_SHA" ] && [ "$EXPECTED_MANIFEST_SHA" != "None" ]; then
  ACTUAL_MANIFEST_SHA=$(curl -fsS -X POST "$BASE_URL/readText" \
    -H 'Content-Type: application/json' \
    -d "{\"storageUri\":\"$STORAGE_URI\"}" | sha256sum | awk '{print $1}')
  if [ "$ACTUAL_MANIFEST_SHA" != "$EXPECTED_MANIFEST_SHA" ]; then
    fail "Manifest SHA mismatch
    expected $EXPECTED_MANIFEST_SHA
    actual   $ACTUAL_MANIFEST_SHA"
  fi
  echo "  ✓ Manifest bytes match manifestFileHash"
fi

# (3) Device-facing update-check: simulate a fresh install at our package.json
# version. Must come back as UPDATE pointing at this bundle. Catches deploys
# that landed in storage but don't match any device (wrong channel, wrong
# targetAppVersion, etc.).
APP_VERSION=$(python3 -c 'import json; print(json.load(open("package.json"))["version"])')
NIL=00000000-0000-0000-0000-000000000000
CHECK_URL="$BASE_URL/hot-updater/app-version/ios/$APP_VERSION/$CHANNEL/$NIL/$NIL/0"
CHECK=$(curl -fsS "$CHECK_URL")
CHECK_STATUS=$(echo "$CHECK" | jget '.get("status","?")')
CHECK_ID=$(echo "$CHECK" | jget '.get("id","?")')
if [ "$CHECK_STATUS" != "UPDATE" ] || [ "$CHECK_ID" != "$BUNDLE_ID" ]; then
  fail "Fresh-install check did not resolve to this bundle
    URL    $CHECK_URL
    got    status=$CHECK_STATUS id=$CHECK_ID
    wanted status=UPDATE        id=$BUNDLE_ID"
fi
echo "  ✓ Fresh-install device check resolves to this bundle"

echo
echo "✓ Deploy verified end-to-end"
