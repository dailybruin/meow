#!/bin/sh
set -e

# Honcho has this weird problem with buffering output
# but in dev we can afford this penalty

# Collect static files
echo "Collect static files"
python meow/manage.py collectstatic --noinput

# DO NOT USE THIS FOR PROD!
export PYTHONUNBUFFERED=1

# Apply database migrations
echo "Apply database migrations"
python meow/manage.py migrate

exec "$@"
