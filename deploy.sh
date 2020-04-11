#/bin/bash

# Turns out docker-compose build has a bug 
# it doesn't respect the .dockerignore

rm meow/frontend/bundles/* -f
rm meow/meow.log -f
npm run build-production &&
docker-compose run web meow/manage.py collectstatic &&
docker build . -t dailybruin/meow &&
docker push dailybruin/meow

