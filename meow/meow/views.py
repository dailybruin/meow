from django.shortcuts import redirect, render, get_object_or_404
from allauth.socialaccount.providers.slack.views import SlackOAuth2Adapter
from rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client


def base(request):
    return render(request, 'base.html')


class SlackLogin(SocialLoginView):
    adapter_class = SlackOAuth2Adapter
    client_class = OAuth2Client
    callback_url = 'http://localhost:5000/slack/'


def redirectToSlack(request):
    print('redirecting!')
    return redirect('https://slack.com/oauth/authorize?scope=identity.basic&client_id=4526132454.463841426112')
