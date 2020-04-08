from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from django.contrib.auth import logout as django_logout
from django.conf import settings
from django.core import serializers

from rest_framework.response import Response
from rest_framework.views import APIView

from meow.utils.decorators import api_login_required

from user_profile.models import User, Theme
from user_profile.serializers import SafeUserSerializer, ThemeSerializer
import json
# Create your views here.

class UserThemes(APIView):
    def get(self, request, id, format=None):
        if not request.user.is_authenticated:
            return HttpResponse('Must be logged in', status=403)
        user = request.user
        themes = Theme.objects.filter(name="Daily Bruin")| Theme.objects.filter(name="Dark Bruin") | Theme.objects.filter(author=user)
        serialized_themes = ThemeSerializer(themes, many=True)
        themeOrderedDict = serialized_themes.data
        return JsonResponse(themeOrderedDict, safe=False, status=200)
    
    def post(self, request, id, format=None):
        if not request.user.is_authenticated:
            return HttpResponse('Must be logged in', status=403)
        user = request.user
        themes = Theme.objects.all()
        req_data = request.data
        new_name = req_data.get("name", None)
        new_primary = req_data.get("primary", None)
        new_secondary = req_data.get("secondary", None)
        new_primary_font_color = req_data.get("primary_font_color", None)
        new_secondary_font_color = req_data.get("secondary_font_color", None)
        new_tertiary = req_data.get("tertiary", None)
        if new_name == "":
            return JsonResponse('Theme name cannot be empty', safe=False, status=400)
        if (themes.filter(name=new_name)):
            return JsonResponse('Theme name taken, enter a new name', safe=False, status=400)
        new_theme = Theme.objects.create(primary=new_primary, secondary=new_secondary, primary_font_color=new_primary_font_color, secondary_font_color=new_secondary_font_color, tertiary=new_tertiary, author=user, name=new_name)
        new_id = Theme.objects.get(name=new_name).pk
        return JsonResponse(new_id, safe=False, status=200)

    def put(self, request, id, format=None):
        if not request.user.is_authenticated:
            return HttpResponse('Must be logged in', status=403)
        user=request.user
        req_data = request.data
        old_name = req_data.get("oldname", None)
        if(old_name == 'Daily Bruin' or old_name == 'Dark Bruin'):
            return HttpResponse('Default themes cannot be modified', status=400)
        new_name = req_data.get("name", None)
        new_primary = req_data.get("primary", None)
        new_secondary = req_data.get("secondary", None)
        new_primary_font_color = req_data.get("primary_font_color", None)
        new_secondary_font_color = req_data.get("secondary_font_color", None)
        new_tertiary = req_data.get("tertiary", None)
        theme_id = req_data.get('id', None)
        if new_name=="":
            return JsonResponse('Theme name cannot be empty', safe=False, status=400)
        if len(new_name)>20:
            return JsonResponse('Theme name is limited to 20 characters', safe=False, status=400)
        if Theme.objects.filter(name=new_name) and (Theme.objects.get(name=new_name).pk != theme_id):
            return JsonResponse('Theme name taken, enter new name', safe=False, status=400)
        else:
            filtered_theme = Theme.objects.filter(pk=id)
            if(len(filtered_theme)>1):
                return HttpResponse('Non-unique name in themes corruption', status=400)
            filtered_theme.update(primary=new_primary, secondary=new_secondary, primary_font_color=new_primary_font_color, secondary_font_color=new_secondary_font_color, tertiary=new_tertiary, author=user, name=new_name)
            return HttpResponse('Sucesss', status=200)
    
    def delete(self, request, id, format=None):
        if not request.user.is_authenticated:
            return HttpResponse('Must be logged in', status=403)
        user=request.user
        themetodelete = Theme.objects.get(pk=id)
        delete_name=themetodelete.name
        if(delete_name == 'Daily Bruin' or delete_name == 'Dark Bruin'):
            return JsonResponse('Default themes cannot be deleted', safe=False, status=400)
        if user.selected_theme == Theme.objects.filter(name=delete_name, author=user)[0]:
            user.selected_theme = Theme.objects.get(name="Daily Bruin")
            user.save()
        if themetodelete.theme_user.count()==0 and themetodelete.related_users.count()==0:
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
        return JsonResponse(themeOrderedDict, safe=False, status=200)

@api_login_required()
def starredthemesIDFetch(request):
    user = request.user
    if request.method == "GET":
        user = User.objects.all().get(username=user.username)
        starred_themes_id = []
        for theme in user.starred_themes.all():
            starred_themes_id.append(theme.pk)
        return JsonResponse(starred_themes_id, safe=False, status=200)

@api_login_required()
def themeStar(request):
    user = request.user
    if request.method == "POST":
        req_data = json.loads(request.body)
        theme_id = req_data['id']
        themes = Theme.objects.all()
        star_theme = themes.get(pk=theme_id)
        user_associated = User.objects.get(username=user.username)
        user_associated.starred_themes.add(star_theme)
        starred_themes_id = user_associated.starred_themes.values_list('pk', flat=True)
        starred_themes_id = list(starred_themes_id)
        return JsonResponse(starred_themes_id, safe=False, status=200)
    elif request.method == "PUT":
        req_data = json.loads(request.body)
        theme_id = req_data['id']
        themes = Theme.objects.all()
        #theme we want to remove the relation
        unstar_theme = themes.get(pk=theme_id)
        user_associated = User.objects.get(username=user.username)
        user_associated.starred_themes.remove(unstar_theme)
        if unstar_theme.author==None and unstar_theme.theme_user.count()==0 and unstar_theme.related_users.count()==1:
            unstar_theme.delete()
        starred_themes_id = user_associated.starred_themes.values_list('pk', flat=True)
        starred_themes_id = list(starred_themes_id)
        return JsonResponse(starred_themes_id, safe=False, status=200)


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
        if new_theme and (new_theme['name'] == 'Dark Bruin' or new_theme['name'] == 'Daily Bruin'):
            #if no one selects the selected theme after deselection,the number of stars for the theme is 0 and author is none, deletion of the theme
            current_selected_theme = user.selected_theme
            if current_selected_theme.author==None and current_selected_theme.theme_user.count()==1 and current_selected_theme.related_users.count()==0:
                current_selected_theme.delete()
            user.selected_theme = Theme.objects.get(name=new_theme['name'])
            updated = True
        elif new_theme and Theme.objects.filter(name=new_theme['name'], id=new_theme['id']).count() > 0:
            # this isn't very good but for now it works
            # the problem is that the front ends sends the entire theme object
            # and all the backend does is use the id.
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
