from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

app_name = "user_profile"

urlpatterns = [
    path('me/', views.me, name="me"),
    path('logout/', views.logout, name="userLogout"),
    path('userThemes/<int:id>/', views.UserThemes.as_view(), name="UserThemes"),
    path('additionalthemes/', views.additionalthemeList, name="additionalthemeList"),
    path('themeStar/', views.themeStar, name="themeStar"),
    path('<str:username>', views.userDetail, name="userDetail"),
    path('', views.userList, name="userList"),
    
]

urlpatterns = format_suffix_patterns(urlpatterns)
