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
        graph = GraphAPI('CAACEdEose0cBAEb6WoOrrsPcZASONpBfZCZBqoIWzoWOsKC66CZC4NUQ9cQ6FUaNPc8EVZC4bgIDtAWrch1rceI7u3TP0RZCiSeZBOqZCc4eXGzHhFteLjZCIJoshJLRgjfv3XrtU0QGj9OQ4uyebqTMBuz1RZCnZBY5fpNHQ8dLnhoLdgnJ9STQabCZBox2hs2CbgcZD')

        # Get my latest posts
        graph.get('me/posts')

        # Post a photo of a parrot
        graph.post(
            path = '668459723166194/feed',
            message = 'parrot22.jpg'
        )
        