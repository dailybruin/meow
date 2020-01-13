from rest_framework import serializers
from scheduler.models import SMPost, Section, PostHistory
from user_profile.serializers import BasicInfoUserSerializer

class SMPostSerializer(serializers.ModelSerializer):
    section = serializers.PrimaryKeyRelatedField
    #category_name = serializers.CharField(source='category.name')
    pub_ready_copy_user = BasicInfoUserSerializer(required=False)
    pub_ready_online_user = BasicInfoUserSerializer(required=False)

    class Meta:
        model = SMPost
        fields = '__all__'

class TagSerializer(serializers.Serializer):
    pass

class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('name', 'id', 'facebook_account_handle',
                  'twitter_account_handle',)

class PostHistorySerializer(serializers.ModelSerializer):
    last_edit_user = BasicInfoUserSerializer(required=False)
    class Meta:
        model = PostHistory
        fields = '__all__'
