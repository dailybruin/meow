# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.http import HttpResponse, Http404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from django.shortcuts import render

from user_profile.models import UserProfile
from user_profile.serializers import UserProfileSerializer

# Create your views here.


class UserProfileDetail(APIView):
    """
    Retrieve, update or delete a user profile.
    """

    def get_object(self, user_id):
        try:
            return UserProfile.objects.get(user_id=user_id)
        except UserProfile.DoesNotExist:
            raise Http404

    def get(self, request, user_id, format=None):
        profile = self.get_object(user_id)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request, user_id, format=None):
        profile = self.get_object(user_id)
        serializer = UserProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id, format=None):
        profile = self.get_object(user_id)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
