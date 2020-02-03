#!/bin/sh
set -e

echo "$DEBUG"
if [ "$DEBUG" -eq "False" ]; then 
  # Collect static files
  echo "Collect static files"
  python meow/manage.py collectstatic --noinput

  # Apply database migrations
  echo "Apply database migrations"
  python meow/manage.py migrate

fi

exec "$@"
