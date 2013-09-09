from django.core.management.base import BaseCommand, CommandError
from scheduler.models import *
import tweepy

class Command(BaseCommand):
    help = "Sends the appropriate social media posts"

    def handle(self, *args, **options):
        CONSUMER_KEY = "OtVavzvwyUfOlETpDOg"
        CONSUMER_SECRET = "0wUHlrQSvB8GMHWDoCdFNjwrmDddug9AjUBjh2qE"
        ACCESS_KEY = "1983491-SphvxRyfObEscR0uxzZrEcIiCVEjyiQIbQiNJjH4"
        ACCESS_SECRET = "Sb7PBeCTRVx6AdnUHpDoXAHWwmtHIm9V9Oxk8k2s8w"
        
        
        auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
        auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
        
        api = tweepy.API(auth)
        api.update_status('test tweet. please ignore.')
        