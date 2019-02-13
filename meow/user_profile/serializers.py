from rest_framework import serializers
from user_profile.models import User
from django.contrib.auth import get_user_model


class UserSerializer(serializers.ModelSerializer):
    section = serializers.StringRelatedField()

    class Meta:
        model = User
        fields = '__all__'


class SafeUserSerializer(serializers.ModelSerializer):
    section = serializers.StringRelatedField()

    class Meta:
        model = User
        exclude = ('password', 'user_permissions',)
