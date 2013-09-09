## Add to settings:
# twitter_consumer_key
# twitter_consumer_secret

from django.core.management.base import BaseCommand, CommandError
from scheduler.models import *
import tweepy
from facepy import GraphAPI

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
        #api.update_status('test tweet. please ignore.')
        
        #######
        #Facebook needs the following permissions:
        # status_update, manage_pages
        
        
        # Initialize the Graph API with a valid access token (optional,
        # but will allow you to do all sorts of fun stuff).
        
        # Get token from here: https://developers.facebook.com/docs/opengraph/howtos/publishing-with-app-token/
#        graph = GraphAPI('72296391616|_vtz8ShgOfzLSgKeDw2quIS1pCc')
        graph = GraphAPI('CAAAAENUzY8ABAFx3ZBkkbpaGmlgM6q3iYUcO3b0R7wxwEUGTnOQVIbgnvQH0u59w1iqkiwtZCnPq3K5frJQLQ5VnAZBkNGiZAVcudSN4g5o0ZBznBAQsBq8BVoc2vF2ezlSCEEkvaoz0WTANyqoqITcLdj2JjPWgQ9jJwLkrTu5gELvZAE93cLYqHNFQQ2xqcZD')

        # Post a photo of a parrot
        graph.post(
            path = '668459723166194/feed',
            message = 'Kenny is a human bean.'
        )
        
