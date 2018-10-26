from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),

    # url(r'', include('social_django.urls')),

    # url(r'^accounts/', include('django_slack_oauth.urls')),
    # url(r'^accounts/', include('allauth.urls')),
    # url(r'^api/rest-auth/', include('rest_auth.urls')),
    # url(r'^api/rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^api/', include('scheduler.urls')),
    url(r'^user/', include('user_profile.urls')),
    url(r'^$', views.base, name='base')
]
