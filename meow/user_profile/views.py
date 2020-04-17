from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.contrib.auth import logout as django_logout
from django.conf import settings
from django.core import serializers

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from meow.utils.decorators import api_login_required

from user_profile.models import User, Theme
from user_profile.serializers import SafeUserSerializer, ThemeSerializer
import json
# Create your views here.

class UserThemes(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        user = request.user
        themes = Theme.objects.filter(name="Daily Bruin")| Theme.objects.filter(name="Dark Bruin") | Theme.objects.filter(author=user)
        serialized_themes = ThemeSerializer(themes, many=True)
        themeOrderedDict = serialized_themes.data
        return JsonResponse(themeOrderedDict, safe=False, status=200)
    
    def post(self, request, id, format=None):
        user = request.user
        req_data = request.data
        new_name =  req_data.get('name', None)
        serializer = ThemeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
        else:
            print(serializer.errors)
            return JsonResponse(serializer.errors, safe=False, status=400)
        new_id = Theme.objects.get(name=new_name).pk
        return JsonResponse(new_id, safe=False, status=200)

    def put(self, request, id, format=None):
        user=request.user
        req_data = request.data
        if(id == 1 or id == 2):
            return HttpResponse('Default themes cannot be modified', status=400)
        serializer = ThemeSerializer(Theme.objects.get(pk=id), data=request.data)
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
            return JsonResponse(serializer.errors,status=400, safe=False)
        return JsonResponse(id, safe=False, status=200)
    
    def delete(self, request, id, format=None):
        user=request.user
        themetodelete = Theme.objects.get(pk=id)
        delete_name=themetodelete.name
        if(delete_name == 'Daily Bruin' or delete_name == 'Dark Bruin'):
            return JsonResponse('Default themes cannot be deleted', safe=False, status=400)
        if user.selected_theme == Theme.objects.filter(name=delete_name, author=user)[0]:
            user.selected_theme = Theme.objects.get(name="Daily Bruin")
            user.save()
        if themetodelete.user_set.count()==0 and themetodelete.related_users.count()==0:
            themetodelete.delete()
        else:
            themetodelete.author=None
            themetodelete.save()
        serialized_theme = ThemeSerializer(user.selected_theme, many=False)
        themeOrderedDict = serialized_theme.data
        return JsonResponse(themeOrderedDict, safe=False, status=200)
        

@api_login_required()
def additionalthemeList(request):
    #this functon list out the additional themes
    user = request.user
    if request.method == "GET":
        themes = Theme.objects.exclude(author=user).exclude(name__in=["Daily Bruin", "Dark Bruin"]).order_by('-favorite_count')
        serialized_themes = ThemeSerializer(themes, many=True)
        themeOrderedDict = serialized_themes.data
        starred_themes_id =[theme.pk for theme in user.starred_themes.all()] 
        return JsonResponse({'additionalThemes': themeOrderedDict, 'starredThemesId': starred_themes_id }, safe=False, status=200)

@api_login_required()
def themeStar(request):
    user = request.user
    if request.method == "POST":
        req_data = json.loads(request.body)
        theme_id = req_data['id']
        themes = Theme.objects.all()
        star_theme = themes.get(pk=theme_id)
        user.starred_themes.add(star_theme)
        starred_themes_id = user.starred_themes.values_list('pk', flat=True)
        starred_themes_id = list(starred_themes_id)
        return JsonResponse({'starredThemesId': starred_themes_id, 'favCount': themes.get(pk=theme_id).favorite_count }, safe=False, status=200)
    elif request.method == "PUT":
        req_data = json.loads(request.body)
        theme_id = req_data['id']
        themes = Theme.objects.all()
        #theme we want to remove the relation
        unstar_theme = themes.get(pk=theme_id)
        user.starred_themes.remove(unstar_theme)
        if unstar_theme.author==None and unstar_theme.user_set.count()==0 and unstar_theme.related_users.count()==1:
            unstar_theme.delete()
        starred_themes_id = user.starred_themes.values_list('pk', flat=True)
        starred_themes_id = list(starred_themes_id)
        return JsonResponse({'starredThemesId': starred_themes_id, 'favCount': themes.get(pk=theme_id).favorite_count }, safe=False, status=200)


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
        if new_bio == "" or new_bio:
            user.bio = new_bio
            updated = True
        if new_instagram == "" or new_instagram:
            user.instagram = new_instagram
            updated = True
        if new_twitter == "" or new_twitter:
            user.twitter = new_twitter
            updated = True
        if new_theme and Theme.objects.filter(name=new_theme['name'], id=new_theme['id']).count() > 0:
            # this isn't very good but for now it works
            # the problem is that the front ends sends the entire theme object
            # and all the backend does is use the id.
            current_selected_theme = user.selected_theme
            if current_selected_theme.author==None and current_selected_theme.user_set.count()==1 and current_selected_theme.related_users.count()==0 and (current_selected_theme.name not in ['Daily Bruin', 'Dark Bruin']):
                current_selected_theme.delete()
            user.selected_theme = Theme.objects.get(name=new_theme['name'], id=new_theme['id'])
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
