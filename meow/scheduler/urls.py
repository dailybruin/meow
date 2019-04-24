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
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

app_name = "scheduler"

urlpatterns = [
    url(r'^post/$',
        views.SMPostList.as_view(),
        name='post-list'),
    url(r'^post/(?P<post_id>[0-9]+)$',
        views.SMPostDetail.as_view(),
        name='post-detail'),
    url(r'^section/$',
        views.SectionList.as_view(),
        name='section-list'),
    url(r'^settings/$', views.user_settings, name="settings"),
    url(r'^twitter-redir/$', views.twitter_redir, name="twitter_redir"),
    url(r'^twitter-connect/$',
        views.twitter_connect, name="twitter_connect"),
    url(r'^fb-redir/$', views.fb_redir, name="fb_redir"),
    url(r'^fb-connect/$', views.fb_connect, name="fb_connect"),
    url(r'^manage/$', views.manage, name="manage"),
    url(r'^history/(?P<post_id>[0-9]+)$', views.get_history, name="history"),
    url(r'^history/$', views.post_history, name="history"),
    url(r'^$', views.dashboard, name='dashboard'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
