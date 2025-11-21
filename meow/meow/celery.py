from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.core.management import call_command
import logging

# set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meow.settings')

app = Celery('meow')

logger = logging.getLogger(__name__)

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django app configs.
app.autodiscover_tasks()


@app.task(bind=True, name='sendposts')
def sendposts(self):
    try:
        call_command('sendposts')
    except SystemExit as exc:
        # Celery treats SystemExit as a hard failure; convert it so we log and surface the error
        logger.exception("sendposts management command exited unexpectedly with SystemExit.")
        raise RuntimeError("sendposts management command exited unexpectedly.") from exc
    except Exception:
        logger.exception("sendposts task failed.")
        raise
