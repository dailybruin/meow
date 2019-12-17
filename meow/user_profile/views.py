from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
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
def themeAdd(request):
    if request.method == "POST":
        themes = Theme.objects.all()
        req_data = json.loads(request.body)
        new_name = req_data.get("name", None)
        new_primary = req_data.get("primary", None)
        new_secondary = req_data.get("secondary", None)
        new_primary_font_color = req_data.get("primary_font_color", None)
        new_secondary_font_color = req_data.get("secondary_font_color", None)
        new_tertiary = req_data.get("tertiary", None)
        new_id = themes[themes.count()-1].pk + 1
        author = req_data.get("author", None)
        user = User.objects.filter(username=author)[0]
        if new_name == "":
            return HttpResponse('Theme name cannot be an empty string', status=400)
        if (themes.filter(name=new_name)):
            return HttpResponse('Theme name must be unique', status=400)
        new_theme = Theme.objects.create(primary=new_primary, secondary=new_secondary, primary_font_color=new_primary_font_color, secondary_font_color=new_secondary_font_color, tertiary=new_tertiary, author=user, name=new_name, pk=new_id)
        return HttpResponse('Successful addition', status=200)


@api_login_required()
def themeEdit(request):
    if request.method == "PUT":
        req_data = json.loads(request.body)
        old_name = req_data.get("oldname", None)
        if(old_name == 'Daily Bruin' or old_name == 'Dark Bruin'):
            return HttpResponse('Default themes cannot be modified', status=400)
        new_name = req_data.get("name", None)
        new_primary = req_data.get("primary", None)
        new_secondary = req_data.get("secondary", None)
        new_primary_font_color = req_data.get("primary_font_color", None)
        new_secondary_font_color = req_data.get("secondary_font_color", None)
        new_tertiary = req_data.get("tertiary", None)
        author = req_data.get("author", None)
        user = User.objects.filter(username=author)[0]
        if Theme.objects.filter(author=user, name=new_name) and new_name != old_name:
            return HttpResponse('Theme name must be unique', status=400)
        else:
            Theme.objects.filter(name=old_name, author=user).update(primary=new_primary, secondary=new_secondary, primary_font_color=new_primary_font_color, secondary_font_color=new_secondary_font_color, tertiary=new_tertiary, author=user, name=new_name)
        return HttpResponse('Successful update', status=200)

@api_login_required()
def themeDelete(request):
    if request.method == "PUT":
        req_data = json.loads(request.body)
        delete_name = req_data.get("name", None)
        if(delete_name == 'Daily Bruin' or delete_name == 'Dark Bruin'):
            return HttpResponse('Default themes cannot be deleted', status=400) 
        delete_author = req_data.get("author", None)
        user = User.objects.filter(username=delete_author)[0]
        Theme.objects.filter(name=delete_name, author=user).delete()
        return HttpResponse('Successful deletion', status=200)

@api_login_required()
def themeList(request):
    user = request.user
    if request.method == "GET":
        themes = Theme.objects.filter(name="Daily Bruin")| Theme.objects.filter(name="Dark Bruin") | Theme.objects.filter(author=user)
        serialized_themes = ThemeSerializer(themes, many=True)
        themeOrderedDict = serialized_themes.data
        return JsonResponse(themeOrderedDict, safe=False)


@api_login_required()
def me(request):
    user = request.user

    serialized_theme = ThemeSerializer(user.selected_theme)

    if request.method == "GET":
        return JsonResponse({
            'username': user.username,
            'first_name': user.first_name,
            # Note: theme in views.me, selected_theme in views.userDetail. This difference is intentional. see UserProfile/index.js and reducers for details
            'theme': serialized_theme.data,
            'groups': list(user.groups.all().values()),
            'profile_img': user.profile_img,
            'isAuthenticated': True
        }, safe=False)
    elif request.method == "PUT":
        req_data = json.loads(request.body)
        new_bio = req_data.get("bio", None)
        new_instagram = req_data.get("instagram", None)
        new_twitter = req_data.get("twitter", None)
        new_theme = req_data.get("selected_theme", None)
        updated = False
        author = User.objects.filter(username=user.username)[0]

        if new_bio == "" or new_bio:
            user.bio = new_bio
            updated = True
        if new_instagram == "" or new_instagram:
            user.instagram = new_instagram
            updated = True
        if new_twitter == "" or new_twitter:
            user.twitter = new_twitter
            updated = True
        if new_theme and new_theme['name'] is 'Dark Bruin' or 'Daily Bruin':
            user.selected_theme = Theme.objects.get(name=new_theme['name'])
            updated = True
        elif new_theme and Theme.objects.filter(name=new_theme['name'], author=author).count() > 0:
            # this isn't very good but for now it works
            # the problem is that the front ends sends the entire theme object
            # and all the backend does is use the id.
            user.selected_theme = Theme.objects.get(name=new_theme['name'], author=author)
            updated = True
        if updated:
            user.save()
            return HttpResponse(status=200)

        return HttpResponse(status=500)



def logout(request):
    if request.user.is_authenticated:
        django_logout(request)
    return HttpResponseRedirect(settings.LOGOUT_REDIRECT_URL)


@api_login_required()
def userList(request):
    if request.method == "GET":
        users = User.objects.values('id', 'username', 'first_name', 'last_name',
                                    'section', 'last_login', 'is_superuser', 'bio', 'role', 'email', 'theme', 'groups')

        usersRawData = SafeUserSerializer(users, many=True)
        usersOrderedDict = usersRawData.data
        return JsonResponse(usersOrderedDict, safe=False)


@api_login_required()
def userDetail(request, username):
    if request.method == "GET":
        user = User.objects.get(username=username)
        userRawData = SafeUserSerializer(user)
        userOrderedDict = userRawData.data
        return JsonResponse(userOrderedDict, safe=False)
