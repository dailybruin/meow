from django.conf.urls import url, include
from django.contrib import admin
from django.contrib.auth import views as auth_views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^login/$', auth_views.LoginView.as_view(
        template_name='scheduler/login.html'), name="login"),
    url(r'^logout/$', auth_views.LogoutView.as_view(
        template_name='scheduler/login.html')),
    url(r'', include('scheduler.urls')),
]
