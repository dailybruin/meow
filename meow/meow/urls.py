from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from . import views
from user_profile import views as user_views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'', include('social_django.urls')),
    url(r'^api/', include('scheduler.urls')),
    url(r'^user/', include('user_profile.urls')),
    url(r'^$', views.base, name='base')
]
