from django.conf.urls import patterns, url
from django.contrib.auth.forms import *

from scheduler import views

urlpatterns = patterns('',
    url(r'^$', views.dashboard, name='dashboard'),
    (r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'scheduler/login.html'}),
)
