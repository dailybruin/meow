#!/usr/bin/env bash

# get rid of old stuff
docker-compose down


REDIS_POSTGRES="REDIS_URL=redis://redis:6379/\nDATABASE_URL=postgres://postgres@db:5432/postgres\n"

if ! grep -q $REDIS_POSTGRES meow/.env; then
       echo -e  $REDIS_POSTGRES > meow/.env	
fi

# this inits everything but will only continue if the pervious step was successful
docker-compose build &&
docker-compose run web meow/manage.py migrate &&
echo ">>> The ids and secrets can be found in the #meow_dev channel's pinned messages" &&
docker-compose run web meow/manage.py init &&
rm -f celerybeat.pid
