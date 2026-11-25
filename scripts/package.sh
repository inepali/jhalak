#!/usr/bin/env bash
# Builds and signs dist/MenuDisplay.wgt with the Tizen CLI.
#   TIZEN_PROFILE  security profile from Tizen Studio's Certificate Manager
#                  (Samsung certificate). Default: MenuDisplay
set -euo pipefail
cd "$(dirname "$0")/.."

PROFILE="${TIZEN_PROFILE:-MenuDisplay}"
command -v tizen >/dev/null || { echo "tizen CLI not found. Add <tizen-studio>/tools/ide/bin to PATH." >&2; exit 1; }

rm -rf app/.buildResult dist
tizen build-web -- "$PWD/app"
tizen package -t wgt -s "$PROFILE" -- "$PWD/app/.buildResult"

mkdir -p dist
mv app/.buildResult/*.wgt dist/MenuDisplay.wgt
rm -rf app/.buildResult
echo "Built dist/MenuDisplay.wgt"
