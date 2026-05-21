#!/usr/bin/env bash
set -euo pipefail

# Build a JS bundle, zip it, drop it into the-oracle's OTA dir, and update the manifest.
#
# Usage: bin/publish-ota.sh <version-int> <display-name> [notes]
# Example: bin/publish-ota.sh 2 0.1.8+2 "Fixed icon spacing on profile"
#
# Env overrides:
#   PLATFORM         (default: ios)
#   OTA_DIR          (default: $HOME/the-oracle/ota/$PLATFORM)
#   BUNDLE_URL_BASE  (default: https://prod.seekmaya.com/updates/$PLATFORM/bundle)

if [ $# -lt 2 ]; then
  echo "usage: $0 <version-int> <display-name> [notes]" >&2
  exit 1
fi

if ! [[ "$1" =~ ^[0-9]+$ ]]; then
  echo "error: version must be a positive integer (got: $1)" >&2
  exit 1
fi

VERSION="$1"
NAME="$2"
NOTES="${3:-}"
PLATFORM="${PLATFORM:-ios}"
OTA_DIR="${OTA_DIR:-$HOME/the-oracle/ota/$PLATFORM}"
BUNDLE_URL_BASE="${BUNDLE_URL_BASE:-https://prod.seekmaya.com/updates/$PLATFORM/bundle}"

cd "$(dirname "$0")/.."  # maya root

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "→ Building JS bundle for $PLATFORM ..."
mkdir -p "$TMP/assets"
npx react-native bundle \
  --platform "$PLATFORM" \
  --dev false \
  --entry-file index.js \
  --bundle-output "$TMP/main.jsbundle" \
  --assets-dest "$TMP/assets"

echo "→ Zipping → $OTA_DIR/$VERSION.zip"
mkdir -p "$OTA_DIR"
ZIP_PATH="$OTA_DIR/$VERSION.zip"
(cd "$TMP" && zip -r -q "$ZIP_PATH" main.jsbundle assets)

SHA=$(sha256sum "$ZIP_PATH" | awk '{print $1}')
SIZE=$(stat -c%s "$ZIP_PATH" 2>/dev/null || stat -f%z "$ZIP_PATH")

echo "→ Writing manifest.json"
VERSION="$VERSION" NAME="$NAME" \
URL="$BUNDLE_URL_BASE/$VERSION.zip" \
SHA="$SHA" NOTES="$NOTES" MANIFEST_PATH="$OTA_DIR/manifest.json" \
python3 - <<'PY'
import json, os
manifest = {
    'version': int(os.environ['VERSION']),
    'name': os.environ['NAME'],
    'url': os.environ['URL'],
    'sha256': os.environ['SHA'],
    'notes': os.environ['NOTES'],
}
with open(os.environ['MANIFEST_PATH'], 'w') as f:
    json.dump(manifest, f, indent=2)
    f.write('\n')
PY

echo "✓ Published $NAME (v$VERSION, ${SIZE} bytes)"
echo "  Bundle: $ZIP_PATH"
echo "  SHA-256: $SHA"
