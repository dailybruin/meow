#!/bin/sh
set -e

echo "$DEBUG"
if [ "$DEBUG" = "False" ]; then 
  # Collect static files
  echo "Collect static files"
  python3.7 meow/manage.py collectstatic --noinput
fi
echo "Apply database migrations"
python3.7 meow/manage.py migrate

exec "$@"
