#!/usr/bin/env bash
# Installs and launches dist/Jhalak.wgt on a Samsung TV in Developer Mode.
#   ./scripts/install.sh 192.168.1.50
set -euo pipefail
cd "$(dirname "$0")/.."

TV_IP="${1:-${TV_IP:-}}"
[ -n "$TV_IP" ] || { echo "Usage: $0 <tv-ip>  (or set TV_IP)" >&2; exit 1; }
[ -f dist/Jhalak.wgt ] || { echo "dist/Jhalak.wgt missing. Run npm run package first." >&2; exit 1; }

sdb connect "$TV_IP"
TARGET="$(sdb devices | awk -v ip="$TV_IP" 'index($1, ip) == 1 { print $3; exit }')"
[ -n "$TARGET" ] || { echo "TV $TV_IP not listed by 'sdb devices'. Is Developer Mode on with this PC's IP?" >&2; exit 1; }

tizen install -n Jhalak.wgt -t "$TARGET" -- "$PWD/dist"
tizen run -p JhalakTV01.Jhalak -t "$TARGET"
