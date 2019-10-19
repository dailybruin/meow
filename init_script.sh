#!/usr/bin/env bash

# ###################################
# NOTE: NEVER RUN THIS ON PRODUCTION!! 
# ###################################

echo -e "Note: never run this on production!"

# get rid of old stuff
docker-compose down
rm meow/frontend/bundles/* -f

REDIS_POSTGRES="REDIS_URL=redis://redis:6379/\nDATABASE_URL=postgres://postgres@db:5432/postgres\n"

if [ ! -f ".env" ]
then
	echo -e  $REDIS_POSTGRES > .env
	read -p "SECRET_KEY: " TMP
	echo -e "SECRET_KEY=$TMP" >> .env

	echo -e "DEBUG=True" >> .env

	read -p "SLACK_CLIENT_ID: " TMP
	echo -e "SLACK_CLIENT_ID=$TMP" >> .env

	read -p "SLACK_CLIENT_SECRET: " TMP
	echo -e "SLACK_CLIENT_SECRET=$TMP" >> .env

	read -p "SLACK_ENDPOINT: " TMP
	echo -e "SLACK_ENDPOINT=$TMP" >> .env
fi


# this inits everything but will only continue if the pervious step was successful
npm i
npm run build
docker-compose build &&
docker-compose run web meow/manage.py migrate &&
echo ">>> The ids and secrets can be found in the #meow_dev channel's pinned messages" &&
docker-compose run web meow/manage.py init &&
echo -e "from scheduler.models import Section\ns = Section(name=\"test\")\ns.save()" | docker-compose run web meow/manage.py shell
rm -f celerybeat.pid
