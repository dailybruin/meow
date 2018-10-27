from rest_framework import serializers
from django.contrib.auth.models import User
from user_profile.models import User, Theme
from social_django.models import AbstractUserSocialAuth


class SocialUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AbstractUserSocialAuth
        fields = ('uid')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name')


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = '__all__'
