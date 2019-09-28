from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.utils import timezone
from django.conf import settings

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

from scheduler.models import MeowSetting, SMPost

logger = logging.getLogger('scheduler')

class Command(BaseCommand):
    help = "Sends the appropriate social media posts"

    def handle(self, *args, **options):
        send_posts = MeowSetting.objects.get(
            setting_key="send_posts").setting_value
        if send_posts == "No" or send_posts == "no":
            logger.info("Post sending is currently off!")
            return

        # Get posts from the database that are ready to send
        regularPosts = SMPost.objects.filter(
            pub_date__lte=timezone.localtime(timezone.now()).date()
        ).filter(
            pub_time__lte=timezone.localtime(timezone.now()).time()
        ).filter(
            pub_ready_copy=True
        ).filter(
            pub_ready_online=True
        ).filter(
            is_active=True
        ).exclude(
            sent=True
        ).exclude(
            section=None
        )

        sendNowPosts = SMPost.objects.filter(
            send_now=True
        ).filter(
            is_active=True
        ).filter(
            pub_ready_copy=True
        ).filter(
            pub_ready_online=True
        ).exclude(
            sent=True
        ).exclude(
            section=None
        )

        posts = regularPosts | sendNowPosts

        if len(posts) == 0:
            logger.info("No posts to send!")

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
                    continue
                else:
                    post.sending = True
                    post.save()

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
                        post.log(traceback.format_exc())
                        logger.critical("Something is very wrong in sendpost.py " + traceback.format_exc())
                        pass  # But we can still try the rest of the posts that are going to be sent
                    continue

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
                        fb_url = call_command('sendfacebook', smpost=post, section=post.section, url=send_url[1], photo_url=photo_url, fb_default_photo=fb_default_photo)
                    # Also post to account
                    if (post.section.also_post_to and
                            post.section.also_post_to.facebook_page_id and post.section.also_post_to.facebook_key):
                        call_command('sendfacebook', smpost=post, section=post.section.also_post_to, url=send_url[1], photo_url=photo_url, fb_default_photo=fb_default_photo)
                # Post to twitter
                if post.post_twitter:
                    # Section's account
                    if (post.section.twitter_access_key and post.section.twitter_access_secret):
                        tweet_url = call_command('sendtweet', smpost=post, section=post.section, url=send_url[1], photo_url=photo_url)
                    # Also post to account
                    if (post.section.also_post_to and
                            post.section.also_post_to.twitter_access_key and post.section.also_post_to.twitter_access_secret):
                        call_command('sendtweet', smpost=post, section=post.section.also_post_to, url=send_url[1], photo_url=photo_url)
            except:
                # Something wrong happened. Don't send this post.
                e = sys.exc_info()[0]
                post.log(traceback.format_exc())
                post.log_error(e, post.section, True)

                slack_data = {
                    "text": ":sadparrot: *{}* has errored at {}"
                    .format(post.slug, timezone.localtime(timezone.now()).strftime("%A, %d. %B %Y %I:%M%p")),
                    "attachments": [{"color": "danger", "title": "Error", "text": str(e)}]
                }

                requests.post(settings.SLACK_ENDPOINT,
                              data=json.dumps(slack_data),
                              headers={'Content-Type': 'application/json'})
                continue

            # Now save whatever we changed to the post
            try:
                post.sending = False
                post.sent = True
                post.sent_time = timezone.localtime(timezone.now())

                slack_data = {
                    "text": ":partyparrot: *{}* has been meow'd to {} at {}"
                    .format(post.slug, post.section.name, post.sent_time.strftime("%A, %d. %B %Y %I:%M%p")),
                    "attachments": []
                }

                if fb_url:
                    slack_data["attachments"].append(
                        {"text": "Facebook: {}".format(fb_url)})

                if tweet_url:
                    slack_data["attachments"].append(
                        {"text": "Twitter: {}".format(tweet_url)})

                requests.post(settings.SLACK_ENDPOINT,
                              data=json.dumps(slack_data),
                              headers={'Content-Type': 'application/json'})
                post.save()
            except (Exception) as e:
                logger.critical("Something is very wrong" + traceback.format_exc())
                post.log(traceback.format_exc())
                post.log_error(e, post.section, True)
                pass  # But we can still try the rest of the posts that are going to be sent
