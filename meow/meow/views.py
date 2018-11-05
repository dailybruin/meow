import requests
import re
from django.shortcuts import redirect, render, get_object_or_404
from allauth.socialaccount.providers.slack.views import SlackOAuth2Adapter
from rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client


def base(request):
    return render(request, 'base.html')


class CustomSlackAdapter(SlackOAuth2Adapter):
    identity_url = 'https://slack.com/api/users.identity'

    def get_data(self, token):
        resp = requests.get(
            self.identity_url,
            params={'token': token}
        )
        resp = resp.json()

        if not resp.get('ok'):
            raise OAuth2Error()

        email = resp.get('user').get('email')
        match = re.search(r'([\w.-]+)@([\w.-]+)', email)

        info = {
            'name': match.group(1),
            'email': resp.get('user').get('email'),
            'user': {
                'email': resp.get('user').get('email'),
                'name': resp.get('user').get('name'),
                'id': resp.get('user').get('id')
            },
            'team': {
                'name': resp.get('team').get('name'),
                'id': resp.get('team').get('id')
            }
        }

        return info


class SlackLogin(SocialLoginView):
    adapter_class = CustomSlackAdapter
    client_class = OAuth2Client
    callback_url = 'http://localhost:5000/slack/'


def redirectToSlack(request):
    print('redirecting!')
    return redirect('https://slack.com/oauth/authorize?scope=identity.basic,identity.avatar,identity.email,identity.team&client_id=4526132454.463841426112')
