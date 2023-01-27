#!/usr/bin/env bash

# ###################################
# NOTE: NEVER RUN THIS ON PRODUCTION!! 
# ###################################

echo -e "Note: never run this on production!"

# get rid of old stuff
docker-compose down
rm meow/frontend/bundles/* -f
rm -f celerybeat.pid


REDIS_POSTGRES="REDIS_URL=redis://redis:6379/\nDATABASE_URL=postgres://postgres@db:5432/postgres\n"
PERIODIC_TASK_MINUTES=2

if [ ! -f ".env" ]
then
	echo -e "Please the following environment variables: "
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
docker-compose build &&
docker-compose run web meow/manage.py migrate &&
echo ">>> The ids and secrets can be found in the #meow_dev channel's pinned messages" &&
docker-compose run web meow/manage.py collectstatic --noinput
docker-compose run web meow/manage.py init 
if [ $? == 0 ]; then
	echo -e "from scheduler.models import Section\ns = Section(name=\"test\")\ns.save()" | docker-compose run web meow/manage.py shell
	if [ $? != 0 ]; then
		echo "!!!!! Failed to create Test section !!!!!"
	else
		echo "Created section \"Test\""
	fi

	echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@myproject.com', '12345')" | docker-compose run web meow/manage.py shell
	if [ $? != 0 ]; then
		echo "!!!!! Failed to create the super user !!!!!"
	else
		echo "Created the super users"
	fi
	
	echo -e "from django_celery_beat.models import PeriodicTask, IntervalSchedule\nschedule=IntervalSchedule.objects.create(every=$PERIODIC_TASK_MINUTES, period=IntervalSchedule.MINUTES)\nPeriodicTask.objects.create(interval=schedule, name='Send Posts', task='sendposts')\n" | docker-compose run web meow/manage.py shell
	if [ $? != 0 ]; then
		echo "!!!!! Failed to create Periodic Task !!!!!"
	else
		echo "Created sendposts Periodic Task (running every $PERIODIC_TASK_MINUTES minutes)"
	fi
fi
rm -f celerybeat.pid
