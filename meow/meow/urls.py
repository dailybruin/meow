from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^api/v1/', include('urls.urls')),
    url(r'healthcheck/', views.healthcheck, name='healthcheck'),
    url(r'healthchecktest/', views.healthchecktest, name='healthchecktest'),
    url(r'', views.base, name='base')
]
