from fabric.api import *

def rs(port=8000):
    local("python manage.py runserver 0.0.0.0:%s" % port, capture=False)
