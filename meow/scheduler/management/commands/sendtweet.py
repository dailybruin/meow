from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.utils import timezone
from django.conf import settings

from datetime import datetime, timedelta
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
    help = "Sends the appropriate tweet"

    def add_arguments(self, parser):
        parser.add_argument(
            '--smpost', default=None,
            help="Post to tweet out.")
        parser.add_argument(
            '--section', default=None,
            help="Section of post.")
        parser.add_argument(
            '--url', default=None,
            help="URL to post.")
        parser.add_argument(
            '--photo_url', default=None,
            help="URL to accompanying photo.")

    def handle(self, *args, **options):
        smpost = options.get('smpost', None)
        section = options.get('section', None)
        url = options.get('url', None)
        photo_url = options.get('photo_url', None)
        try:
            logger.info('Sending Tweet: {}: {}'.format(smpost.slug, smpost.post_twitter))
            CONSUMER_KEY = MeowSetting.objects.get(
                setting_key='twitter_consumer_key').setting_value
            CONSUMER_SECRET = MeowSetting.objects.get(
                setting_key='twitter_consumer_secret').setting_value
            ACCESS_KEY = section.twitter_access_key
            ACCESS_SECRET = section.twitter_access_secret

            auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
            auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)

            api = tweepy.Client(
                consumer_key=CONSUMER_KEY,
                consumer_secret=CONSUMER_SECRET,
                access_token=ACCESS_KEY,
                access_token_secret=ACCESS_SECRET
            )            
            
            # Make the tweet follow DB social media standards
            tweet = smpost.post_twitter

            if url is not None:
                tweet = tweet + " " + url

            res = api.create_tweet(text=tweet)

            # Add the id for the post to the database
            tweet_id = res.data['id']
            smpost.id_twitter = tweet_id
            smpost.save()

            tweet_url = f"https://twitter.com/twitter/status/{tweet_id}"
            logger.info('Tweet {} has sent successfully. URL: {}'.format(
                smpost.slug,
                tweet_url,
                )
            )
            return tweet_url

        except tweepy.errors.TweepyException as e:
            smpost.log(traceback.format_exc())
            smpost.log_error(e, section, True)

            logger.error("Send tweet errored\nslug: {} {}".format(smpost.slug, traceback.format_exc()))
        except Exception as e:
            smpost.log(traceback.format_exc())
            smpost.log_error(e, section, True)

            logger.error("Send tweet errored\nslug: {} {}".format(smpost.slug, traceback.format_exc()))
