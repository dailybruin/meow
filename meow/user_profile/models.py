from django.db import models
from django.contrib.auth.models import AbstractUser, UserManager, PermissionsMixin
from .roles import ROLE_CHOICES, CONTRIBUTOR
from django.db.models.signals import m2m_changed


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
    profile_img = models.URLField(default=None, null=True)
    # gets first theme (Daily Bruin) in database and sets as default theme
    selected_theme = models.ForeignKey('Theme', null=True, on_delete=models.SET_DEFAULT, default=1)
    starred_themes = models.ManyToManyField('Theme', related_name='related_users')

    def __str__(self):
        return self.username

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']


class Theme(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=False)
    primary = models.CharField(max_length=8)
    secondary = models.CharField(max_length=8)
    primary_font_color = models.CharField(max_length=8)
    secondary_font_color = models.CharField(max_length=8)
    tertiary = models.CharField(max_length=8)
    author = models.ForeignKey('User', on_delete=models.SET_NULL, null=True)
    favorite_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['pk']

def m2m_favorite_themes(sender, **kwargs):
    action = kwargs['action']
    #when a new theme is added to the many to many relation from the user's point of view
    if kwargs['pk_set']:
        #there should only be one theme updated each time the function is called
        selected_themes = kwargs['model'].objects.filter(pk__in=kwargs['pk_set'])
        if action == 'post_add' or action == 'post_remove':
            for item in selected_themes:
                print (item.favorite_count)
                item.favorite_count = item.related_users.count()
                print (item.favorite_count)
                item.save()
        else:
            pass


m2m_changed.connect(m2m_favorite_themes, sender=User.starred_themes.through)
