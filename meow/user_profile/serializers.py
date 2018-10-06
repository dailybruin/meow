from rest_framework import serializers
from django.contrib.auth.models import User
from user_profile.models import UserProfile, Theme


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    theme = ThemeSerializer()

    class Meta:
        model = UserProfile
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = '__all__'
