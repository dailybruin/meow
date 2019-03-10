from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth import logout as django_logout
from django.conf import settings
from django.core import serializers

from rest_framework.response import Response

from meow.utils.decorators import api_login_required
from user_profile.models import User, Theme
from user_profile.serializers import SafeUserSerializer, ThemeSerializer
import json
# Create your views here.

@api_login_required()
def themeList(request):
    if request.method == "GET":
        themes = Theme.objects.all()
        serialized_themes = ThemeSerializer(themes, many=True)
        themeOrderedDict = serialized_themes.data
        return JsonResponse(themeOrderedDict, safe=False)

@api_login_required()
def me(request):
    user = request.user
    serialized_theme = ThemeSerializer(user.selected_theme);
    return JsonResponse({
        'username': user.username,
        'first_name': user.first_name,
        'theme': serialized_theme.data,
        'groups': list(user.groups.all().values()),
        'isAuthenticated': True
    }, safe=False)


@api_login_required()
def logout(request):
    django_logout(request)
    return HttpResponseRedirect("http://localhost:5000")


@api_login_required()
def userList(request):
    if request.method == "GET":
        users = User.objects.values('id', 'username', 'first_name', 'last_name',
                                    'section', 'last_login', 'is_superuser', 'bio', 'role', 'email', 'theme', 'groups')
        print(users)
        usersRawData = SafeUserSerializer(users, many=True)
        usersOrderedDict = usersRawData.data
        print(usersOrderedDict)
        return JsonResponse(usersOrderedDict, safe=False)


@api_login_required()
def userDetail(request, username):
    if request.method == "GET":
        user = User.objects.get(username=username)
        print(user)
        userRawData = SafeUserSerializer(user)
        userOrderedDict = userRawData.data
        print(userOrderedDict)
        return JsonResponse(userOrderedDict, safe=False)
