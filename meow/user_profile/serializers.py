from rest_framework import serializers
from django.contrib.auth.models import User
from user_profile.models import UserProfile, Theme
from rest_auth.serializers import UserDetailsSerializer


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = '__all__'


class UserSerializer(UserDetailsSerializer):

    bio = serializers.CharField(source="userprofile.bio")

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('bio',)

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('userprofile', {})
        bio = profile_data.get('bio')

        instance = super(UserSerializer, self).update(instance, validated_data)

        # get and update user profile
        profile = instance.userprofile
        if profile_data and bio:
            profile.bio = bio
            profile.save()
        return instance
