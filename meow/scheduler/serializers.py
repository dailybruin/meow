from rest_framework import serializers
from .models import SMPost

class SMPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMPost
        fields = '__all__'