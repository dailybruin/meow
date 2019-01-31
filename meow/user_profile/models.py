from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, PermissionsMixin
from .roles import ROLE_CHOICES, CONTRIBUTOR


class User(AbstractUser):
    objects = UserManager()
    bio = models.CharField(max_length=512, null=True)
    role = models.CharField(
        max_length=2,
        choices=ROLE_CHOICES,
        default=CONTRIBUTOR
    )
    profile_img = models.ImageField(upload_to='profile/imgs/',
                                    null=True)
    theme = models.ForeignKey(
        'Theme', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.username

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


class Theme(models.Model):
    background_color = models.CharField(max_length=7, blank=True)
