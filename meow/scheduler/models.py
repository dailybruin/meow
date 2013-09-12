from django.db import models
from datetime import datetime

class SMPost(models.Model):
    slug = models.CharField(max_length=100, null=True, blank=False)
    pub_date = models.DateField(null=True, blank=True)
    pub_time = models.TimeField(null=True, blank=True)
    story_url = models.URLField(max_length=500, null=True, blank=True)
    post_twitter = models.TextField(null=True, blank=True)
    post_facebook = models.TextField(null=True, blank=True)
    section = models.ForeignKey('Section', blank=True)
    pub_ready_copy = models.BooleanField(default=False, help_text="Is this copy-edited?")
    pub_ready_online = models.BooleanField(default=False, help_text="Is this ready to send out?")
    
    sent = models.BooleanField(default=False, help_text="Sent out? This should never be set manually.")
    sent_time = models.DateTimeField(null=True, blank=True, help_text="What time was it actually sent out?")
    sent_error = models.BooleanField(default=False, blank=False, null=False, help_text="Did the send generate an error?")
    sent_error_text = models.TextField(null=True, blank=True)
    
    def __unicode__(self):
        return self.slug
        
    def log_error(self, e, section):
        self.sent_error = True
        self.sent_error_text = str(self.sent_error_text) + "Error: " + str(section.name) + " " + str(datetime.now()) + " -- " + str(e) + "\n"
        self.save()
    
class Section(models.Model):
    name = models.CharField(max_length=100, blank=False)
    twitter_account_handle = models.CharField(max_length=100, null=True, blank=True)
    facebook_account_handle = models.CharField(max_length=100, null=True, blank=True)
    also_post_to = models.ForeignKey('Section', blank=True, help_text="This only goes down one level (i.e. no recursion)", null=True)
    twitter_access_key = models.CharField(max_length=500, null=True, blank=True)
    twitter_access_secret = models.CharField(max_length=500, null=True, blank=True)
    facebook_key = models.CharField(max_length=500, null=True, blank=True, help_text="<a target='_blank' href='http://stackoverflow.com/questions/17620266/getting-a-manage-page-access-token-to-upload-events-to-a-facebook-page'>Instructions here</a>")
    facebook_page_id = models.CharField(max_length=200, null=True, blank=True)
    
    def __unicode__(self):
        return self.name

class MeowSetting(models.Model):
    setting_key = models.CharField(max_length=100, blank=False, unique=True)
    setting_value = models.CharField(max_length=500)
    
    def __unicode__(self):
        return self.setting_key