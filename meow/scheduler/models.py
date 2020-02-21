from django.db import models
from django.conf import settings
from datetime import datetime
import sys
from pyshorteners import Shortener
import requests
import urllib
from django.core.mail import send_mail
from bs4 import BeautifulSoup


from django.dispatch import receiver
from django.db.models.signals import post_save
from meow.celery import app
import logging
from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.utils import timezone
from django.conf import settings
from scheduler.models import *

from datetime import datetime, timedelta
from facepy import GraphAPI
from facepy.exceptions import FacepyError
import tweepy
import re
import io
import requests
import json
import sys
import time
import traceback
import logging


class SMPostTag(models.Model):
    """
    Tags which meowers provide for analytics reasons.
    """
    text = models.CharField(max_length=40)
    # last touch is the last time someone called .save() on it.
    # whenever the a meow is edited on the frontend,
    # the server will call .save() on all of its tags, thereby setting
    # last touch time to right now.
    last_touch = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text

class SMPost(models.Model):
    slug = models.CharField(max_length=100, null=True, blank=False)
    pub_date = models.DateField(null=True, blank=True)
    pub_time = models.TimeField(null=True, blank=True)
    story_url = models.URLField(max_length=500, null=True, blank=True)
    story_short_url = models.URLField(max_length=500, null=True, blank=True)
    featured_image_url = models.URLField(max_length=500, null=True, blank=True)
    post_twitter = models.TextField(null=True, blank=True)
    # change to decimal(38, 0) if not big enough
    id_twitter = models.DecimalField(
        default=0, max_digits=25, decimal_places=0)
    post_facebook = models.TextField(null=True, blank=True)
    post_newsletter = models.TextField(null=True, blank=True, default="")
    post_notes = models.TextField(null=True, blank=True, default="")
    # change to decimal(38, 0) if not big enough
    id_facebook = models.DecimalField(
        default=0, max_digits=25, decimal_places=0)
    section = models.ForeignKey(
        'Section', blank=True, null=True, on_delete=models.SET_NULL)
    pub_ready_copy = models.BooleanField(
        default=False, help_text="Is this copy-edited?")
    pub_ready_online = models.BooleanField(
        default=False, help_text="Is this ready to send out?")

    pub_ready_copy_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, blank=True, null=True, related_name='+', on_delete=models.SET_NULL)
    pub_ready_online_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, blank=True, null=True, related_name='+', on_delete=models.SET_NULL)
    last_edit_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, blank=True, null=True, related_name='+', on_delete=models.SET_NULL)

    sent = models.BooleanField(
        default=False, help_text="Sent out? This should never be set manually.")
    sending = models.BooleanField(
        default=False, help_text="Is something currently trying to send this post?")
    sent_time = models.DateTimeField(
        null=True, blank=True, help_text="What time was it actually sent out?")
    sent_error = models.BooleanField(
        default=False, blank=False, null=False, help_text="Did the send generate an error?")
    sent_error_text = models.TextField(null=True, blank=True)
    send_now = models.BooleanField(
        default=False, help_text="Do you want to send this post immediately?")

    is_active = models.BooleanField(
        default=True, help_text="If false, consider mock-deleted.")

    tags = models.ManyToManyField(SMPostTag)

    def __str__(self):
        return "" if self.slug is None else self.slug

    class Meta:
        permissions = (
            ("add_edit_post", "Can add and edit posts"),
            ("approve_copy", "Can mark the post as approved by copy"),
            ("approve_online", "Can mark the post as approved by online"),
        )
        ordering = ['-pub_time', ]

    def log(self, msg):
        text = "\n[" + str(datetime.now()) + "] - "
        text += msg + "\n"
        if self.sent_error_text != None:
            self.sent_error_text += text
        else:
            self.sent_error_text = text
        self.save()

    def log_error(self, e, section, send_email=False):
        self.sent_error = True
        self.sent_error_text = str(self.sent_error_text) + "Error: " + str(
            section.name) + " " + str(datetime.now()) + " -- " + str(e) + "\n"
        self.sending = False
        self.save()

        if not send_email:
            return

        addresses_to_notify = EmailNotification.objects.all()
        for email in addresses_to_notify:
            try:
                email_message = """
{name},

A post on meow did not send. Log in at {site_url} to check out the posts from today to see what went wrong.

Here is the error message:

Time: {time}
Section: {section}
{error}

--
Thanks,
{organization_name}
                """
                site_url = MeowSetting.objects.get(
                    setting_key='site_url').setting_value
                organization_name = MeowSetting.objects.get(
                    setting_key='organization_name').setting_value
                from_email = MeowSetting.objects.get(
                    setting_key='from_email').setting_value

                email_message = email_message.format(name=email.name, error=str(e), time=str(datetime.now(
                )), section=str(section.name), site_url=site_url, organization_name=organization_name)
                send_mail('[' + organization_name + '] Meow send error', email_message,
                          from_email, [email.email_address], fail_silently=False)
            except:
                # We never want a failed email to cause any other errors
                # So stop exceptions from bubbling here
                pass

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
        SENDING = 9

    def post_status(self):
        # Please don't change the order of these unless you understand what you're doing
        if self.sent and self.sent_error:
            return self.post_statuses.SEND_ERROR
        elif self.sent:
            return self.post_statuses.SENT
        elif self.sending:
            return self.post_statuses.SENDING
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
            self.post_statuses.SEND_ERROR: "Send error",
            self.post_statuses.SENT: "Sent",
            self.post_statuses.READY: "Ready",
            self.post_statuses.NOT_SCHEDULED: "Not scheduled",
            self.post_statuses.COPY_EDITED: "Copy-edited",
            self.post_statuses.DRAFT: "Draft",
            self.post_statuses.NO_PUB_DATE: "No date",
            self.post_statuses.NO_SECTION: "No section",
            self.post_statuses.SENDING: "Sending...",
        }[self.post_status()]

    # Returns a 2-tuple with (canonical URL, sending URL)
    # Either both are set or neither are set
    def get_send_url(self):
        # If we don't have a URL in the first place, return empty strings
        # Or return the short URL if it has already been made
        if not self.story_url:
            return (None, None)
        elif self.story_short_url:
            return (self.story_url, self.story_short_url)
        elif self.section.shorten_links == False:
            return(self.story_url, self.story_url)

        # Set up for Bitly Goodness
        try:
            BITLY_ACCESS_TOKEN = MeowSetting.objects.get(
                setting_key='bitly_access_token').setting_value
            shortener = Shortener('Bitly', bitly_token=BITLY_ACCESS_TOKEN)
        except:
            print("[WARN] URL Shortener is not properly configured!")
            return(self.story_url, self.story_url)

        # api=bitly_api.Connection(access_token=BITLY_ACCESS_TOKEN)

        # If Bitly fails, we'll just continue with our canonical URL
        # try:
        #     short_url = api.shorten(self.story_url)['url']
        # except bitly_api.BitlyError as e:
        #     self.log_error(e, self.section)
        #     short_url = None
        # except:
        #     e = sys.exc_info()[0]
        #     short_url = None
        #     self.log_error(e, self.section)

        try:
            short_url = shortener.short(self.story_url)
        except:
            e = sys.exc_info()[0]
            short_url = None
            self.log_error(e, self.section)

        if short_url:
            self.story_short_url = short_url
            self.save()
            return (self.story_url, short_url)
        else:
            return (self.story_url, self.story_url)

    # Returns either the photo's URL or None
    # In this process it checks whether or not the URL is valid. An exception will be thrown
    #  if it is not valid
    def get_post_photo_url(self):
        if not self.story_url:
            return None
        if self.featured_image_url:
            return self.featured_image_url
        # Get the post HTML
        post_request = requests.get(self.story_url)
        if post_request.status_code != 200:
            # We only want to continue if we actually got a 200 status code.
            # (Requests takes care of redirects and sets the final status_code
            # to 200 if everying went swimmingly.)
            error = ("HTTP Error: Got status code " + str(post_request.status_code) +
                     " while requesting URL: " + str(self.story_url))
            self.log_error(error, self.section, True)
            raise BaseException(error)
            return None

        post_dom = BeautifulSoup(post_request.text, "html.parser")
        if self.section.image_selector:
            image_selector = self.section.image_selector
        else:
            try:
                image_selector = MeowSetting.objects.get(
                    setting_key='default_image_selector').setting_value
            except:
                print("[WARN] Default Image Selector not properly set up!")
                return None

        post_image_tags = post_dom.select(image_selector)

        # Detect if the post has an actual image/src we can use (why not be too careful)
        post_image_url = None
        if post_image_tags:
            post_image_attrs = post_image_tags[0].attrs
            if 'data-lazy-src' in post_image_attrs:
                post_image_url = post_image_attrs['data-lazy-src']
            else:
                post_image_url = post_image_attrs['src']

        if post_image_url:
            self.featured_image_url = post_image_url
            self.save()

        return post_image_url


class Section(models.Model):
    name = models.CharField(max_length=100, blank=False)
    twitter_account_handle = models.CharField(
        max_length=100, null=True, blank=True)
    facebook_account_handle = models.CharField(
        max_length=100, null=True, blank=True)
    also_post_to = models.ForeignKey(
        'Section', blank=True, help_text="This only goes down one level (i.e. no recursion)", null=True, on_delete=models.SET_NULL)
    twitter_access_key = models.CharField(
        max_length=500, null=True, blank=True)
    twitter_access_secret = models.CharField(
        max_length=500, null=True, blank=True)
    facebook_key = models.CharField(max_length=500, null=True, blank=True,
                                    help_text="<a target='_blank' href='http://stackoverflow.com/questions/17620266/getting-a-manage-page-access-token-to-upload-events-to-a-facebook-page'>Instructions here</a>")
    facebook_page_id = models.CharField(max_length=200, null=True, blank=True)
    image_selector = models.CharField(max_length=200, null=True, blank=True)
    facebook_default_photo = models.CharField(
        max_length=500, null=True, blank=True)
    shorten_links = models.BooleanField(
        default=False, null=False, blank=False, help_text="Shorten links using bit.ly?")

    def __str__(self):
        return self.name


class MeowSetting(models.Model):
    setting_key = models.CharField(max_length=100, blank=False, unique=True)
    setting_value = models.CharField(max_length=500)

    def __str__(self):
        return self.setting_key


class EmailNotification(models.Model):
    name = models.CharField(max_length=100, blank=False)
    email_address = models.EmailField(blank=False, unique=True)

    def __str__(self):
        return self.name + " <" + self.email_address + ">"

class PostHistory(models.Model):
    """
    PostHistory has currently 2 access methods, one implicit and one explicit
    Explicit (through API access): `get_history'
    Implicit (through event listener): `new_history'
    See views.py for details.
    """
    smpost = models.ForeignKey(SMPost, on_delete=models.CASCADE)
    post_facebook = models.TextField(null=True, blank=True, default=None)
    post_twitter = models.TextField(null=True, blank=True, default=None)
    post_newsletter = models.TextField(null=True, blank=True, default=None)
    last_edit_user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    creation_time = models.DateTimeField(auto_now_add=True)

@app.task(ignore_result=True)
def tester(num):
    test_logger = logging.getLogger('test_logger')
    test_logger.info("Successfully executed cronjob")
    test_logger.info(str(num))
    sendPost(num)

def sendPost(idno):
    logger = logging.getLogger('test_logger')
    logger.info("in sendpost")
    posts = SMPost.objects.filter(id = idno)
    logger.info(len(posts))
    logger.info(posts)
    logger.info("now sending prev post")
    for post in posts:
        try:
            # Make sure nothing else is trying to send this post right now
            # This is not atomic; if meow ever scales a lot more, this will need to be re-written
            # TODO: Yes this isn't.
            if post.send_now:
                post.sending = False
                post.sent = True
                post.sent_time = timezone.localtime(timezone.now())
                post.save()

            if post.sending:
                logger.info(
                    "sendpost.py: Post {}-{} is currently in the process of being sent. ".format(post.slug, post.id))
                continue  # if its in the processs of being sent, ignore
            else:
                post.sending = True
                post.save()

            logger.info("sendpost.py: Post {}-{} will begin sending. ".format(post.slug, post.id))

            # Make sure this post should actually be sent out. If it's more than
            # 20 minutes late, we're gonna mark it as an error and send an error
            # message.
            send_date = datetime.combine(post.pub_date, post.pub_time)
            send_grace_period = timedelta(minutes=20)
            if (timezone.now() - timezone.make_aware(send_date)) > send_grace_period:
                try:
                    post.sending = False
                    post.log_error(
                        "Would have sent more than 20 minutes late.", post.section, True)
                    post.sending = False
                    post.sent = True
                    post.sent_time = timezone.localtime(timezone.now())
                    post.save()
                except:
                    logger.critical("Something is very wrong in sendpost.py ")
                    logger.critical("Something is very wrong in sendpost.py " + str(traceback.format_exc()))
                    post.log(traceback.format_exc())

                logger.info(
                    "sendpost.py: Post {}-{} failed to send because it would been late. ".format(post.slug, post.id))
                continue  # skip this iteration of the loop so this post will not be posted.

            # This is just Bitly -- it won't throw any exceptions
            # send_url[0] is canonical. send_url[1] is short url.
            send_url = post.get_send_url()

            # This will throw an error if the page cannot be reached
            photo_url = post.get_post_photo_url()

            # Get the default fb photo and pass it to the send function
            # so the same default photo gets posted everywhere
            fb_default_photo = None
            if post.section.facebook_default_photo:
                fb_default_photo = post.section.facebook_default_photo
            else:
                try:
                    fb_default_photo = MeowSetting.objects.get(
                        setting_key='fb_default_photo').setting_value
                except:
                    logger.warning(
                        "[WARN] Facebook default photo setting is not set properly!")
            fb_url = None
            tweet_url = None
            # Post to facebook
            if post.post_facebook:
                # Section's account
                if (post.section.facebook_page_id and post.section.facebook_key):
                    fb_url = call_command('sendfacebook', smpost=post, section=post.section, url=send_url[1],
                                          photo_url=photo_url, fb_default_photo=fb_default_photo)
                # Also post to account
                if (post.section.also_post_to and
                    post.section.also_post_to.facebook_page_id and post.section.also_post_to.facebook_key):
                    call_command('sendfacebook', smpost=post, section=post.section.also_post_to, url=send_url[1],
                                 photo_url=photo_url, fb_default_photo=fb_default_photo)
            # Post to twitter
            if post.post_twitter:
                # Section's account
                if (post.section.twitter_access_key and post.section.twitter_access_secret):
                    tweet_url = call_command('sendtweet', smpost=post, section=post.section, url=send_url[1],
                                             photo_url=photo_url)
                # Also post to account
                if (post.section.also_post_to and
                    post.section.also_post_to.twitter_access_key and post.section.also_post_to.twitter_access_secret):
                    call_command('sendtweet', smpost=post, section=post.section.also_post_to, url=send_url[1],
                                 photo_url=photo_url)
        except:
            # Something wrong happened. Don't send this post.
            logger.error(
                "sendpost.py: {} has errored. It will NOT be sent. trackback: {}"
                    .format(post.slug, traceback.format_exc())
            );

            e = sys.exc_info()[0]
            post.log(traceback.format_exc())
            post.log_error(e, post.section, True)
            continue  # don't do anything else

        # Now save whatever we changed to the post
        try:
            post.sending = False
            post.sent = True
            post.sent_time = timezone.localtime(timezone.now())
            post.save()
        except (Exception) as e:
            logger.critical("Something is very wrong" + traceback.format_exc())
            post.log(traceback.format_exc())
            post.log_error(e, post.section, True)


@receiver(post_save, sender=SMPost)
def create_cronjob(sender, instance, **kwargs):
    if(instance.pub_ready_online):
        year = instance.pub_date.year
        month = instance.pub_date.month
        day = instance.pub_date.day
        hour = instance.pub_time.hour
        minute = instance.pub_time.minute
        second = instance.pub_time.second
        microsecond = instance.pub_time.microsecond
        idno = instance.id
        tester.apply_async((idno,), eta=datetime(year, month, day, hour, minute, second, microsecond), expires=datetime(year,month,day,hour
                                                                                                                        ,minute,second + 10,microsecond))
