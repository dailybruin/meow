#!/usr/bin/env bash

# get rid of old stuff
docker-compose down
rm meow/frontend/bundles/* -f

REDIS_POSTGRES="REDIS_URL=redis://redis:6379/\nDATABASE_URL=postgres://postgres@db:5432/postgres"

if [ ! -f ".env" ]
then
	echo -e  $REDIS_POSTGRES > .env
	echo -e "\nThe following values can be found in the pinned messages of the #meow-dev channel"
	read -p "SECRET_KEY: " TMP
	echo -e "SECRET_KEY=$TMP" >> .env

	read -p "Debug (True/False): " TMP
	echo -e "Debug=$TMP" >> .env

	read -p "SLACK_CLIENT_ID: " TMP
	echo -e "SLACK_CLIENT_ID=$TMP" >> .env

	read -p "SLACK_CLIENT_SECRET: " TMP
	echo -e "SLACK_CLIENT_SECRET=$TMP" >> .env

	read -p "SLACK_ENDPOINT: " TMP
	echo -e "SLACK_ENDPOINT=$TMP" >> .env
fi


# this inits everything but will only continue if the pervious step was successful
docker-compose build &&
docker-compose run web meow/manage.py migrate &&
echo ">>> The ids and secrets can be found in the #meow_dev channel's pinned messages" &&
docker-compose run web meow/manage.py init &&
rm -f celerybeat.pid
