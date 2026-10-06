#!/bin/sh
# Install the live kikfia.com files from one commit, then run the launch check.
# Runs on the Hostinger server (from a one-off cron job):  sh update-live.sh <full commit sha> [with-config]
# kikfia-config.js holds the ad and analytics IDs: it is installed only when missing, or with "with-config".
# The mail login (kikfia-mail.ini), the Meta token (kikfia-meta.ini) and the lead log (kikfia-leads.csv)
# live one folder above the web root and are never in the repo.
set -eu
REF="$1"
RAW="https://raw.githubusercontent.com/stkvideos3-dot/Kashi-website/$REF"
SITE="$HOME/domains/kikfia.com/public_html"
PRIV="$HOME/domains/kikfia.com"
if [ -f "$PRIV/kikfia-mail.ini" ]; then chmod 600 "$PRIV/kikfia-mail.ini"; LOGIN=present; else LOGIN=MISSING; fi
if [ -f "$PRIV/kikfia-meta.ini" ]; then chmod 600 "$PRIV/kikfia-meta.ini"; CAPI=on; else CAPI=off; fi
FILES="contact.php .htaccess index.html privacy.html kikfia-measure.js robots.txt sitemap.xml favicon.ico favicon.svg apple-touch-icon.png icon-512.png"
if [ ! -f "$SITE/kikfia-config.js" ] || [ "${2:-}" = "with-config" ]; then FILES="$FILES kikfia-config.js"; fi
# download everything first, then move into place, so a failed download changes nothing
for f in $FILES; do curl -fsS -o "$HOME/kikfia-new-$f" "$RAW/kikfia/$f"; done
for f in $FILES; do mv "$HOME/kikfia-new-$f" "$SITE/$f"; done
curl -fsS -o "$HOME/kikfia-launch-check.php" "$RAW/kikfia-tools/launch-check.php"
# send one test lead per commit, however often the cron job fires
if [ ! -e "$HOME/.kikfia-installed-$REF" ]; then
  rm -f "$HOME/.kikfia-launch-check-sent"
  touch "$HOME/.kikfia-installed-$REF"
fi
echo "installed from $REF: $FILES"
echo "mail login file $LOGIN, Meta Conversions API $CAPI"
php "$HOME/kikfia-launch-check.php"
