from rest_framework import serializers
from user_profile.models import User, Theme
from django.contrib.auth import get_user_model


class BasicInfoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'profile_img', 'last_name', 'first_name', 'instagram', 'twitter')


class ThemeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Theme
        fields = '__all__'

class SafeUserSerializer(serializers.ModelSerializer):
    section = serializers.StringRelatedField()
    selected_theme = ThemeSerializer()

    class Meta:
        model = User
        exclude = ('password', 'user_permissions')
