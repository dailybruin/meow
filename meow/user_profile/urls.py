from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

app_name = "user_profile"

urlpatterns = [
    path('me/', views.me, name="me"),
    path('logout/', views.logout, name="userLogout"),
    path('themes/', views.themeList, name="themeList"),
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Implemented Theme Favorite and Unfavorite functions
    path('additionalthemes/', views.additionalthemeList, name="additionalthemeList"),
    path('themeAdd/', views.themeAdd, name="themeAdd"),
    path('themeEdit/', views.themeEdit, name="themeEdit"),
    path('themeDelete/', views.themeDelete, name="themeDelete"),
<<<<<<< HEAD
<<<<<<< HEAD
    path('themeStar/', views.themeStar, name="themeStar"),
    path('starredthemesID/', views.starredthemesIDFetch, name="starredthemesID"),
=======
    path('themeAdd/', views.themeAdd, name="themeAdd"),
>>>>>>> Added theme color dial in the frontend, added new themeAdd view in views.py
=======
>>>>>>> Implemented theme add, theme delete and theme update functions in views.py of user profile
=======
    path('themeStar/', views.themeStar, name="themeStar"),
    path('starredthemesID/', views.starredthemesIDFetch, name="starredthemesID"),
>>>>>>> Implemented Theme Favorite and Unfavorite functions
    path('<str:username>', views.userDetail, name="userDetail"),
    path('', views.userList, name="userList"),
    
]

urlpatterns = format_suffix_patterns(urlpatterns)
