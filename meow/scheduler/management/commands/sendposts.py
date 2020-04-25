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
        ).exclude(
            sending=True
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
        ).exclude(
            sending=True
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
                    logger.info("sendpost.py: Post {}-{} is currently in the process of being sent. ".format(post.slug, post.id))
                    continue # if its in the processs of being sent, ignore
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

                        # print out all of the model's fields

                        debugging = SMPost.objects.filter(id=post.id)
                        logger.error("Would have sent more than 20 minutes late")
                        debug_str = "Model Fields\n"
                        for key, value in debugging.all().values()[0].items():
                            debug_str += str(key) + ":   " + str(value) + "\n"
                        logger.error(debug_str)
                    except:
                        logger.critical("Something is very wrong in sendpost.py ")
                        logger.critical("Something is very wrong in sendpost.py " + str(traceback.format_exc()))
                        post.log(traceback.format_exc())

                    logger.info("sendpost.py: Post {}-{} failed to send because it would been late. ".format(post.slug, post.id))
                    continue # skip this iteration of the loop so this post will not be posted.

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
                logger.error(
                    "sendpost.py: {} has errored. It will NOT be sent. trackback: {}"
                    .format(post.slug, traceback.format_exc())
                );

                e = sys.exc_info()[0]
                post.log(traceback.format_exc())
                post.log_error(e, post.section, True)
                continue # don't do anything else

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
