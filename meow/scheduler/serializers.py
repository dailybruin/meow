from rest_framework import serializers
from scheduler.models import SMPost, Section
from user_profile.serializers import BasicInfoUserSerializer

class SMPostSerializer(serializers.ModelSerializer):
    section = serializers.PrimaryKeyRelatedField
    #category_name = serializers.CharField(source='category.name')
    pub_ready_copy_user = BasicInfoUserSerializer()
    pub_ready_online_user = BasicInfoUserSerializer()

    class Meta:
        model = SMPost
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('name', 'id', 'facebook_account_handle',
                  'twitter_account_handle',)
