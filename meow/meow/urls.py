from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('scheduler.urls')),
    url(r'^api/', include('user_profile.urls')),
    url(r'^$', views.base, name='base')
]
