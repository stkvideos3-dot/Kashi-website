#!/bin/sh
# One-off: shows which client address PHP sees behind Hostinger's CDN, so the form's per-visitor
# limit keys on the visitor and not on a CDN edge. Writes a temporary probe, fetches it, deletes it.
set -u
SITE="$HOME/domains/kikfia.com/public_html"
NAME="ipdiag-$(date +%s).php"
printf '%s' '<?php header("Content-Type: text/plain"); foreach (["REMOTE_ADDR","HTTP_X_FORWARDED_FOR","HTTP_X_REAL_IP","HTTP_CF_CONNECTING_IP","HTTP_TRUE_CLIENT_IP","HTTP_X_CLIENT_IP","HTTP_FORWARDED","HTTP_X_HCDN_CLIENT_IP"] as $k) echo $k, "=", $_SERVER[$k] ?? "-", "\n";' > "$SITE/$NAME"
echo "== through the CDN (https://kikfia.com):"
curl -sS -m 20 "https://kikfia.com/$NAME"
echo "== server outbound addresses:"
curl -sS -m 10 -4 https://api.ipify.org; echo
curl -sS -m 10 -6 https://api64.ipify.org; echo
rm -f "$SITE/$NAME"
echo "== probe removed: $([ -e "$SITE/$NAME" ] && echo NO || echo yes)"
