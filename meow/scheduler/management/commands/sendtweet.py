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

from scheduler.models import MeowSetting, SMPost


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
            print('Sending Tweet: {}'.format(smpost.post_twitter))
            CONSUMER_KEY = MeowSetting.objects.get(
                setting_key='twitter_consumer_key').setting_value
            CONSUMER_SECRET = MeowSetting.objects.get(
                setting_key='twitter_consumer_secret').setting_value
            ACCESS_KEY = section.twitter_access_key
            ACCESS_SECRET = section.twitter_access_secret

            auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
            auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)

            api = tweepy.API(auth)

            # Make the tweet follow DB social media standards
            tweet = smpost.post_twitter

            if url is not None:
                tweet = tweet + " " + url

            res = api.update_status(status=tweet)

            print("----------------------")
            print(res.id)

            # Add the id for the post to the database
            smpost.id_twitter = res.id
            smpost.save()

            return "https://twitter.com/statuses/{}".format(res.id)

        except tweepy.TweepError as e:
            smpost.log(traceback.format_exc())
            smpost.log_error(e, section, True)
            slack_data = {
                "text": ":sadparrot: *{}* has errored at {}"
                .format(smpost.slug, timezone.localtime(timezone.now()).strftime("%A, %d. %B %Y %I:%M%p")),
                "attachments": [{"color": "danger", "title": "Twitter Error", "text": str(e)}]
            }

            requests.post(settings.SLACK_ENDPOINT,
                          data=json.dumps(slack_data),
                          headers={'Content-Type': 'application/json'})
