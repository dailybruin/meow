from rest_framework import serializers
from scheduler.models import SMPost, Section


class SMPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMPost
        fields = '__all__'


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = '__all__'
