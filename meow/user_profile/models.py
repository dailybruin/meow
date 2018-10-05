from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                primary_key=True)
    first_name = models.CharField(max_length=100, blank=True, default="")
    last_name = models.CharField(max_length=100, blank=True, default="")
    email = models.EmailField()
    profile_img = models.ImageField(upload_to='profile/imgs/',
                                    null=True)
    theme = models.ForeignKey(
        'Theme', blank=True, null=True, on_delete=models.SET_NULL)

    class Meta:
        default_related_name = 'profile'


class Theme(models.Model):
    background_color = models.CharField(max_length=7, blank=True)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
