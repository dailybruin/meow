from django.db import models

class SMPost(models.Model):
    slug = models.CharField(max_length=100, null=True, blank=False)
    pub_date = models.DateField(null=True)
    pub_time = models.TimeField(null=True)
    story_url = models.URLField(max_length=500, null=True)
    post_twitter = models.TextField(null=True)
    post_facebook = models.TextField(null=True)
    section = models.ForeignKey('Section')
    pub_ready_copy = models.BooleanField(default=False, help_text="Is this copy-edited?")
    pub_ready_online = models.BooleanField(default=False, help_text="Is this ready to send out?")
    sent = models.BooleanField(default=False, help_text="Sent out? This should never be set manually.")

class Section(models.Model):
    name = models.CharField(max_length=100, blank=False)
    twitter_account_handle = models.CharField(max_length=100, null=True)
    facebook_account_handle = models.CharField(max_length=100, null=True)
    post_to_main = models.BooleanField(default=True, help_text="Whenever a post to this section is made, also post it to the main newsroom social media accounts?")
    twitter_access_key = models.CharField(max_length=500, null=True)
    twitter_access_secret = models.CharField(max_length=500, null=True)
    facebook_key = models.CharField(max_length=500, null=True)
    facebook_page_id = models.CharField(max_length=200, null=True)