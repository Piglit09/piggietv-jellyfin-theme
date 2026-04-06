#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CSS_DIR="$ROOT_DIR/css"
JS_DIR="$ROOT_DIR/js"
DIST_DIR="$ROOT_DIR/dist"

mkdir -p "$DIST_DIR"

echo "Building CSS..."
cat \
  "$CSS_DIR/login.css" \
  "$CSS_DIR/home.css" \
  "$CSS_DIR/details.css" \
  "$CSS_DIR/sidebar.css" \
  "$CSS_DIR/settings.css" \
  "$CSS_DIR/custom.css" \
  > "$DIST_DIR/custom.css"

echo "" >> "$DIST_DIR/custom.css"
echo "/* Build completed on $(date) */" >> "$DIST_DIR/custom.css"

echo "Copying JS..."
cp "$JS_DIR/custom.js" "$DIST_DIR/custom.js"

echo "Build complete:"
echo "  $DIST_DIR/custom.css"
echo "  $DIST_DIR/custom.js"
