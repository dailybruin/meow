#!/bin/sh
set -e
source /venv/bin/activate

# Collect static files
echo "Collect static files"
python meow/manage.py collectstatic --noinput

# Apply database migrations
echo "Apply database migrations"
python meow/manage.py migrate

exec "$@"
