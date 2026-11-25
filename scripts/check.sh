#!/usr/bin/env bash
# Quick checks that need no Tizen SDK: manifest is valid XML, JS parses,
# every file config.xml points at exists.
set -euo pipefail
cd "$(dirname "$0")/../app"

xmllint --noout config.xml
node --check js/main.js
for f in index.html icon.png css/style.css js/main.js images/logo.png; do
  [ -f "$f" ] || { echo "missing app/$f" >&2; exit 1; }
done
echo "OK"
