# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse, Http404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.shortcuts import render

from user_profile.models import User
from user_profile.serializers import UserSerializer

# Create your views here.


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

    def get_object(self, user_id):
        try:
            return User.objects.get(user_id=user_id)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, user_id, format=None):
        profile = self.get_object(user_id)
        serializer = UserSerializer(profile)
        return Response(serializer.data)

    def put(self, request, user_id, format=None):
        profile = self.get_object(user_id)
        serializer = UserSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id, format=None):
        profile = self.get_object(user_id)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
