from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^rest-auth/', include('rest_auth.urls')),
    url(r'^rest-auth/slack/$', views.SlackLogin.as_view(), name='fb_login'),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^api/', include('scheduler.urls')),
    # it looks like schedulers and user profile's urls live at the same place. Might conflict later..
    url(r'^api/', include('user_profile.urls')),
    url(r'^redirectToSlack/', views.redirectToSlack, name="redirect-to-slack"),
    # make sure we can still access static files
    url(r'', views.base, name='base')
]
