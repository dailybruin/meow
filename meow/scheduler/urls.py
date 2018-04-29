# from django.conf.urls import patterns, url
# from django.contrib.auth.forms import *

# from scheduler import views

# urlpatterns = patterns('',
#     (r'^login/$', 'django.contrib.auth.views.login', {'template_name': 'scheduler/login.html'}),
#     (r'^logout/$', 'django.contrib.auth.views.logout', {'template_name': 'scheduler/login.html'}),
#     url(r'^edit/(?P<post_id>\d+)/$', views.edit, name="edit"),
#     url(r'^add/$', views.add, name="add"),
#     url(r'^settings/$', views.user_settings, name="settings"),
#     url(r'^manage/twitter-connect/$', views.twitter_connect, name="twitter_connect"),
#     url(r'^manage/fb-connect/$', views.fb_connect, name="fb_connect"),
#     url(r'^manage/$', views.manage, name="manage"),
#     url(r'^$', views.dashboard, name='dashboard'),
# )


from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^edit/(?P<post_id>\d+)/$', views.edit, name="edit"),
    url(r'^add/$', views.add, name="add"),
    url(r'^settings/$', views.user_settings, name="settings"),
    url(r'^api/send-now/(?P<post_id>\d+)/$', views.send_posts_now, name="send_posts_now"),
    url(r'^manage/twitter-connect/$',
        views.twitter_connect, name="twitter_connect"),
    url(r'^manage/fb-connect/$', views.fb_connect, name="fb_connect"),
    url(r'^manage/$', views.manage, name="manage"),
    url(r'^$', views.dashboard, name='dashboard'),
]
