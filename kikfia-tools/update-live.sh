#!/bin/sh
# Install the live kikfia.com form handler and .htaccess from one commit, then run the launch check.
# Runs on the Hostinger server (from a one-off cron job):  sh update-live.sh <full commit sha>
# The mail login (kikfia-mail.ini, one folder above the web root) is never in the repo.
set -eu
REF="$1"
RAW="https://raw.githubusercontent.com/stkvideos3-dot/Kashi-website/$REF"
SITE="$HOME/domains/kikfia.com/public_html"
INI="$HOME/domains/kikfia.com/kikfia-mail.ini"
if [ -f "$INI" ]; then chmod 600 "$INI"; LOGIN=present; else LOGIN=MISSING; fi
for f in contact.php .htaccess; do
  curl -fsS -o "$HOME/kikfia-new$f" "$RAW/kikfia/$f"
  mv "$HOME/kikfia-new$f" "$SITE/$f"
done
curl -fsS -o "$HOME/kikfia-launch-check.php" "$RAW/kikfia-tools/launch-check.php"
# send one test lead per commit, however often the cron job fires
if [ ! -e "$HOME/.kikfia-installed-$REF" ]; then
  rm -f "$HOME/.kikfia-launch-check-sent"
  touch "$HOME/.kikfia-installed-$REF"
fi
echo "installed contact.php and .htaccess from $REF, mail login file $LOGIN"
php "$HOME/kikfia-launch-check.php"
