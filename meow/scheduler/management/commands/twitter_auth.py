from django.core.management.base import BaseCommand, CommandError
from scheduler.models import *
import tweepy

class Command(BaseCommand):
    help = "Sends the appropriate social media posts"

    # Thanks http://talkfast.org/2010/05/31/twitter-from-the-command-line-in-python-using-oauth/
    def handle(self, *args, **options):
        CONSUMER_KEY = MeowSetting.objects.get(setting_key='twitter_consumer_key').setting_value
        CONSUMER_SECRET = MeowSetting.objects.get(setting_key='twitter_consumer_secret').setting_value

        auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
        auth.secure = True
        auth_url = auth.get_authorization_url()
        print 'Please authorize: ' + auth_url
        verifier = raw_input('PIN: ').strip()
        auth.get_access_token(verifier)
        print "ACCESS_KEY = '%s'" % auth.access_token.key
        print "ACCESS_SECRET = '%s'" % auth.access_token.secret
