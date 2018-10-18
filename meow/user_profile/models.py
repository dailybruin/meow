from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.


class User(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, primary_key=True)
    bio = models.CharField(max_length=512, null=True)
    profile_img = models.ImageField(upload_to='profile/imgs/',
                                    null=True)
    theme = models.ForeignKey(
        'Theme', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.user.username

    class Meta:
        default_related_name = 'userprofile'


class Theme(models.Model):
    background_color = models.CharField(max_length=7, blank=True)
