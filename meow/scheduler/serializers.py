from rest_framework import serializers
from scheduler.models import SMPost, Section, PostHistory, SMPostTag
from user_profile.serializers import BasicInfoUserSerializer

class SMPostSerializer(serializers.ModelSerializer):
    section = serializers.PrimaryKeyRelatedField
    #category_name = serializers.CharField(source='category.name')
    pub_ready_copy_user = BasicInfoUserSerializer(required=False)
    pub_ready_online_user = BasicInfoUserSerializer(required=False)
    tags = serializers.SlugRelatedField(
        many=True,
        slug_field='text',
        queryset=SMPostTag.objects.all()
     )

    class Meta:
        model = SMPost
        fields = '__all__'

class SMPostTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMPostTag
        fields = ('text',)

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
