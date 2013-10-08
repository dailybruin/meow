from django.db import models
from datetime import datetime
from django.contrib.auth.models import User

class SMPost(models.Model):
    slug = models.CharField(max_length=100, null=True, blank=False)
    pub_date = models.DateField(null=True, blank=True)
    pub_time = models.TimeField(null=True, blank=True)
    story_url = models.URLField(max_length=500, null=True, blank=True)
    post_twitter = models.TextField(null=True, blank=True)
    post_facebook = models.TextField(null=True, blank=True)
    section = models.ForeignKey('Section', blank=True, null=True)
    pub_ready_copy = models.BooleanField(default=False, help_text="Is this copy-edited?")
    pub_ready_online = models.BooleanField(default=False, help_text="Is this ready to send out?")
    
    pub_ready_copy_user = models.ForeignKey(User, blank=True, null=True, related_name='+')
    pub_ready_online_user = models.ForeignKey(User, blank=True, null=True, related_name='+')
    last_edit_user = models.ForeignKey(User, blank=True, null=True, related_name='+')
    
    sent = models.BooleanField(default=False, help_text="Sent out? This should never be set manually.")
    sent_time = models.DateTimeField(null=True, blank=True, help_text="What time was it actually sent out?")
    sent_error = models.BooleanField(default=False, blank=False, null=False, help_text="Did the send generate an error?")
    sent_error_text = models.TextField(null=True, blank=True)
    
    def __unicode__(self):
        return self.slug
    
    class Meta:
        permissions = (
            ("add_edit_post", "Can add and edit posts"),
            ("approve_copy", "Can mark the post as approved by copy"),
            ("approve_online", "Can mark the post as approved by online"),
        )
        
    def log_error(self, e, section):
        self.sent_error = True
        self.sent_error_text = str(self.sent_error_text) + "Error: " + str(section.name) + " " + str(datetime.now()) + " -- " + str(e) + "\n"
        self.save()
        
    # This whole thing is to be able to change the dashboard message without messing with application logic
    #  and to enumerate statuses. Maybe I just like C a little too much.
    class post_statuses:
        SEND_ERROR = 1
        SENT = 2
        READY = 3
        NOT_SCHEDULED = 4
        COPY_EDITED = 5
        DRAFT = 6
        NO_PUB_DATE = 7
        NO_SECTION = 8
        
    def post_status(self):
        # Please don't change the order of these unless you understand what you're doing
        if self.sent and self.sent_error:
            return self.post_statuses.SEND_ERROR
        elif self.sent:
            return self.post_statuses.SENT
        elif self.pub_date == None:
            return self.post_statuses.NO_PUB_DATE
        elif self.pub_ready_copy and self.pub_ready_online and (self.post_twitter or self.post_facebook) and self.pub_date and self.pub_time and self.section:
            return self.post_statuses.READY
        elif self.pub_ready_copy and self.pub_ready_online and (self.post_twitter or self.post_facebook):
            return self.post_statuses.NOT_SCHEDULED
        elif self.pub_ready_copy and (self.post_twitter or self.post_facebook):
            return self.post_statuses.COPY_EDITED
        else:
            return self.post_statuses.DRAFT
    
    def post_status_string(self):
        return {
            self.post_statuses.SEND_ERROR : "Send error",
            self.post_statuses.SENT : "Sent",
            self.post_statuses.READY : "Ready",
            self.post_statuses.NOT_SCHEDULED: "Not scheduled",
            self.post_statuses.COPY_EDITED : "Copy-edited",
            self.post_statuses.DRAFT : "Draft",
            self.post_statuses.NO_PUB_DATE : "No date",
            self.post_statuses.NO_SECTION : "No section",
        }[self.post_status()]
    
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