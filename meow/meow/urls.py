from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from . import views
from scheduler.views import twitter_connect

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/', include('urls.urls')),
    # Older X app configurations still return to this callback.
    url(r'^manage/twitter-connect/$', twitter_connect,
        name='legacy_twitter_connect'),
    url(r'healthcheck/', views.healthcheck, name='healthcheck'),
    url(r'healthchecktest/', views.healthchecktest, name='healthchecktest'),
    url(r'', views.base, name='base')
]
