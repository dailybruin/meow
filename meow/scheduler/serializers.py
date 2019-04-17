from rest_framework import serializers
from scheduler.models import SMPost, Section


class SMPostSerializer(serializers.ModelSerializer):
    section = serializers.PrimaryKeyRelatedField
    pub_ready_copy_user = serializers.PrimaryKeyRelatedField
    pub_ready_online_user = serializers.PrimaryKeyRelatedField

    class Meta:
        model = SMPost
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = ('name', 'id', 'facebook_account_handle',
                  'twitter_account_handle',)
