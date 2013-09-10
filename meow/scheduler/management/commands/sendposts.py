## Add to settings:
# twitter_consumer_key
# twitter_consumer_secret

from django.core.management.base import BaseCommand, CommandError
from scheduler.models import *
import tweepy
from facepy import GraphAPI
from scheduler.models import *

class Command(BaseCommand):
    help = "Sends the appropriate social media posts"
    
    def sendTweet(self, smpost):
        print smpost.post_twitter
        CONSUMER_KEY = "OtVavzvwyUfOlETpDOg"
        CONSUMER_SECRET = "0wUHlrQSvB8GMHWDoCdFNjwrmDddug9AjUBjh2qE"
        ACCESS_KEY = "1983491-SphvxRyfObEscR0uxzZrEcIiCVEjyiQIbQiNJjH4"
        ACCESS_SECRET = "Sb7PBeCTRVx6AdnUHpDoXAHWwmtHIm9V9Oxk8k2s8w"
        
        
        auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
        auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
        
        api = tweepy.API(auth)
        api.update_status(smpost.post_twitter)
        

    def sendFacebookPost(self, smpost):
        print smpost.post_facebook
        #follow these steps: http://stackoverflow.com/questions/17620266/getting-a-manage-page-access-token-to-upload-events-to-a-facebook-page
        #Facebook needs the following permissions:
        # status_update, manage_pages
        
        
        # Initialize the Graph API with a valid access token (optional,
        # but will allow you to do all sorts of fun stuff).
        
        # Get token from here: https://developers.facebook.com/docs/opengraph/howtos/publishing-with-app-token/
        # appGraph = GraphAPI('72296391616|_vtz8ShgOfzLSgKeDw2quIS1pCc')
        graph = GraphAPI('CAAAAENUzY8ABAGsDJqlrs0yNcLbq8tHAxFFoZBpkneXLZBaeAwMDnJUDEiROJZC9H9Pt7trXF4ZC8xRsM8ptfUGRP6RvBi8VlW73x8zzDqaor6VYboHs5XUxFaQ3TK9qjkqyQFMbx7yu801CJdxlx43LOZCk4h2pelKvqgrPaNkDQ0VTeJWuatBwPO6vW7QQZD') # This should not expire


        # Post a photo of a parrot
        graph.post(
            path = '668459723166194/feed',
            message = smpost.post_facebook,
            link = smpost.story_url,
            picture = "http://dailybruin.com/images/2013/01/dailybruinicon2.jpeg",
        )

    def handle(self, *args, **options):
        p = SMPost.objects.get(pk=1)
        self.sendFacebookPost(p)
