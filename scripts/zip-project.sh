#!/usr/bin/env bash
# =============================================================================
# zip-project.sh — package the project for handover/archival.
# Excludes dependencies, build output, git history and secrets.
# Usage: npm run zip   (or: bash scripts/zip-project.sh [output-name])
# =============================================================================
set -euo pipefail

cd "$(dirname "$0")/.."

NAME="${1:-gih-tour-travel-$(date +%Y%m%d)}"
OUT="${NAME}.zip"

rm -f "$OUT"

zip -r "$OUT" . \
  -x "node_modules/*" \
  -x ".next/*" \
  -x "out/*" \
  -x "build/*" \
  -x "dist/*" \
  -x "coverage/*" \
  -x ".git/*" \
  -x ".env" \
  -x ".env.local" \
  -x ".env.*.local" \
  -x "*.zip" \
  -x ".DS_Store" \
  -x "image-search/*"

echo "✔ Created $OUT ($(du -h "$OUT" | cut -f1))"
