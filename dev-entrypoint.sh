#!/bin/sh
set -e

rsync -arv --progress /usr/src/cache/node_modules/. /meow/node_modules/
cmd="nohup npm run watch";
$cmd &

echo "$DEBUG"
if [ "$DEBUG" = "False" ]; then 
  # Collect static files
  echo "Collect static files"
  python3.7 meow/manage.py collectstatic --noinput
fi
echo "Apply database migrations"
python3.7 meow/manage.py migrate

exec "$@"
