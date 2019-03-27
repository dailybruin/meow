from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth.models import Group

from scheduler.models import Section, MeowSetting
import requests

CHANNELS_ENDPOINT = "https://slack.com/api/users.conversations"
PROFILE_ENDPOINT = "https://slack.com/api/users.profile.get"


def set_roles(backend, user, response, details, *args, **kwargs):
    if backend.name == 'meow':
        access_token = response['access_token']
        PARAMS = {'token': access_token,
                  'types': 'private_channel', 'exclude_archived': 'true'}
        slack_res = requests.get(url=CHANNELS_ENDPOINT, params=PARAMS)
        slack_res_json = slack_res.json()
        channels_list = slack_res_json["channels"]

        editor_channel = MeowSetting.objects.get(setting_key='editor_channel').setting_value
        copy_channel = MeowSetting.objects.get(setting_key='copy_channel').setting_value
        online_channel = MeowSetting.objects.get(setting_key='online_channel').setting_value

        editor_group = Group.objects.get(name='Editors')
        copy_group = Group.objects.get(name='Copy')
        online_group = Group.objects.get(name='Online')

        for channel in channels_list:
            if channel["name"] == editor_channel:
                user.groups.add(editor_group)
            elif channel["name"] == copy_channel:
                user.groups.add(copy_group)
            elif channel["name"] == online_channel:
                user.groups.add(online_group)

        set_profile_picture(backend, user, response, details, args, kwargs)
    else:
        print('for some reason this is not a slack thing')
    return None

def set_profile_picture(backend, user, response, details, *args, **kwargs):
    # if backend.name == 'meow':
    access_token = response['access_token']
    PARAMS = {'token': access_token} # do i need to pass the user or is that implicity passed?
    slack_res = requests.get(url=PROFILE_ENDPOINT, params=PARAMS)
    slack_res_json = slack_res.json()
    print(slack_res.json())


    user.profile_img = slack_res_json["profile"]["image_original"];
    user.save();
    # else:
    print('for some reason this is not a slack thing')
    # return None
