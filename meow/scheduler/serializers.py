from rest_framework import serializers
from scheduler.models import SMPost, Section, PostHistory
from user_profile.serializers import BasicInfoUserSerializer

class SMPostSerializer(serializers.ModelSerializer):
    section = serializers.PrimaryKeyRelatedField

    class Meta:
        model = SMPost
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('name', 'id', 'facebook_account_handle',
                  'twitter_account_handle',)

class PostHistorySerializer(serializers.ModelSerializer):
    last_edit_user_data = BasicInfoUserSerializer(required=False)
    class Meta:
        model = PostHistory
        fields = '__all__'
