from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth.models import Group

from scheduler.models import Section, MeowSetting
import requests
import logging
import traceback
import sys

CHANNELS_ENDPOINT = "https://slack.com/api/users.conversations"
PROFILE_ENDPOINT = "https://slack.com/api/users.profile.get"

logger = logging.getLogger('oauth')


def set_roles_and_profile_pic(backend, user, response, details, *args, **kwargs):
    if backend.name == 'meow':
        try:
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
                if channel["name"] == copy_channel:
                    user.groups.add(copy_group)
                if channel["name"] == online_channel:
                    user.groups.add(online_group)

            set_profile_picture(backend, user, response, details, args, kwargs)
        except Exception as e:
            logger.error(traceback.format_exc())
            raise e # throw it again so the system doesn't do continue

    else:
        print('for some reason this is not a slack thing')
    return None

def set_profile_picture(backend, user, response, details, *args, **kwargs):

    # if backend.name == 'meow':
    try:
        access_token = response.get('access_token', None)
        if not access_token:
            logger.error("No Access Token provided by response: " + str(response))
        PARAMS = {'token': access_token}
        slack_res = requests.get(url=PROFILE_ENDPOINT, params=PARAMS)
        slack_res_json = slack_res.json()
        logger.info("User signed in: " + str(slack_res.json()))


        user.profile_img = slack_res_json["profile"].get("image_original", None)
        user.save()
    except Exception as e:
        logger.error(traceback.format_exc())
        raise e # throw it again so the system doesn't do continue
    # else:
    # return None
