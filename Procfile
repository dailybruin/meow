web: /meow/meow/manage.py runserver 0.0.0.0:5000
worker: export PYTHONPATH=meow && celery -A meow worker -l info --concurrency=1 -f celeryworker.log
clock: export PYTHONPATH=meow && celery -A meow beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler -f celeryclock.log
