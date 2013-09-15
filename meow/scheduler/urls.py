from django.conf.urls import patterns, url
from django.contrib.auth.forms import *

from scheduler import views

urlpatterns = patterns('',
    (r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'scheduler/login.html'}),
    (r'^logout/$', 'django.contrib.auth.views.logout', {'template_name': 'scheduler/login.html'}),
    url(r'^edit/(?P<post_id>\d+)/$', views.edit, name="edit"),
    url(r'^$', views.dashboard, name='dashboard'),
)
