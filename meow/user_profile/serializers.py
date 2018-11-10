from rest_framework import serializers
from django.contrib.auth.models import User
from user_profile.models import User, Theme
# from social_django.models import UserSocialAuth
from rest_framework.authtoken.models import Token


# class SocialUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserSocialAuth
#         fields = ('uid',)

# Originally I was using this serializer when sending tokens but
# it was easier to just make a dictionary with key and username myself
# see user_profile/views.py

# class TokenSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Token
#         fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = '__all__'
