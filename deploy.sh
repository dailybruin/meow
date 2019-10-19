#/bin/bash

rm meow/frontend/bundles/* -f
npm run build-production &&
docker-compose run web meow/manage.py collectstatic &&
docker-compose build &&
docker tag meow dailybruin/meow &&
docker push dailybruin/meow

