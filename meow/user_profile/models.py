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

    instagram = models.URLField(default="https://www.instagram.com/chubby.umi/")
    twitter = models.URLField(default="https://twitter.com/Cats")
    profile_img = models.URLField(default=None, null=True);
    # gets first theme (Daily Bruin) in database and sets as default theme
    selected_theme = models.ForeignKey('Theme', null=True, on_delete=models.SET_NULL, default=1)

    def __str__(self):
        return self.username

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


class Theme(models.Model):
    primary = models.CharField(max_length=8)
    secondary = models.CharField(max_length=8)
    primary_font_color = models.CharField(max_length=8)
    secondary_font_color = models.CharField(max_length=8)
    tertiary = models.CharField(max_length=8)

    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=50)

