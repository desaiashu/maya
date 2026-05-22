#!/usr/bin/env bash
set -euo pipefail

# Thin wrapper around `hot-updater deploy` so the existing `npm run publish-ota`
# entry point keeps working.
#
# Usage:
#   bin/publish-ota.sh "fix: short description"            # targets current native version, prod channel
#   bin/publish-ota.sh "..." 0.1.x                          # custom semver range
#   CHANNEL=staging bin/publish-ota.sh "..."                # custom channel
#   HOT_UPDATER_BASE_URL=... bin/publish-ota.sh "..."       # override OTA host
#
# What hot-updater does end-to-end:
#   1. Builds the JS bundle (Hermes-compiled).
#   2. SHA-256 hashes + packages it as a zip with manifest.json.
#   3. (Optional) computes bsdiff patches against recent prior bundles.
#   4. Uploads via @hot-updater/standalone storage HTTP API.
#   5. POSTs the bundle metadata via @hot-updater/standalone repository HTTP API.

if [ $# -lt 1 ]; then
  echo "usage: $0 \"<message>\" [target-app-version-range]" >&2
  exit 1
fi

MESSAGE="$1"
TARGET="${2:-}"
CHANNEL="${CHANNEL:-production}"

cd "$(dirname "$0")/.."  # maya root

ARGS=(deploy -p ios -c "$CHANNEL" -m "$MESSAGE")
if [ -n "$TARGET" ]; then
  ARGS+=(-t "$TARGET")
fi

exec npx hot-updater "${ARGS[@]}"
