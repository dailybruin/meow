# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse, Http404
from django.views import View

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.shortcuts import render, redirect

from user_profile.models import User
from user_profile.serializers import UserSerializer

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
# from social_django.models import UserSocialAuth

import urllib.parse

# Create your views here.
GOOGLE_LOGIN_URL_PREFIX = '/accounts/slack/login/'


def redirectToSlack(request):
    coming_from = request.GET.get("next", "/")
    url_params = {
        "process": "login",
        "next": coming_from
    }
    suffix = urllib.parse.urlencode(url_params)
    return redirect(GOOGLE_LOGIN_URL_PREFIX + suffix)


# class SocialUserDetail(APIView):
#     """
#     Retrieve, update or delete a user profile.
#     """

#     def get_object(self, user_id):
#         try:
#             return UserSocialAuth.objects.get(user_id=user_id)
#         except User.DoesNotExist:
#             raise Http404
#     def get(self, request, user_id, format=None):
#         profile = self.get_object(user_id)
#         serializer = SocialUserSerializer(profile)
#         return Response(serializer.data)


# class SocialUserProfileList(APIView):
#     def get(self, request, user_id, format=None):
#         profile = self.get_object(user_id)
#         serializer = SocialUserSerializer(profile)
#         return Response(serializer.data)


class UserProfileList(APIView):
    """
    List all User Profile, or create a new User Profile.
    """

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileDetail(APIView):
    """
    Retrieve, update or delete a user profile.
    """

    def get_object(self, token_key):
        try:
            return Token.objects.get(key=token_key)
        except Token.DoesNotExist:
            raise Http404


    def get(self, request, token_key, format=None):
        authtoken = self.get_object(token_key)
        #should we use a serializer if its something this simple?
        return Response({"key":token_key, "user":authtoken.user.username})

    # def put(self, request, user_id, format=None):
    #     profile = self.get_object(user_id)
    #     serializer = UserSerializer(profile, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    #
    # def delete(self, request, user_id, format=None):
    #     profile = self.get_object(user_id)
    #     profile.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)
