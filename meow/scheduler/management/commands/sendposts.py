## Add to settings:
# twitter_consumer_key
# twitter_consumer_secret

from django.core.management.base import BaseCommand, CommandError
from scheduler.models import *
import tweepy
from facepy import GraphAPI
from scheduler.models import *
from datetime import datetime
import urllib2
from bs4 import BeautifulSoup

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
        
        # Make the tweet follow DB social media standards
        tweet = smpost.post_twitter
        if smpost.story_url is not None:
            tweet = tweet + " " + smpost.story_url
        
        api.update_status(tweet)
        

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


        # Get the post HTML
        usock = urllib2.urlopen(smpost.story_url)
        post_html = usock.read()
        usock.close()
        post_dom = BeautifulSoup(post_html)
        post_image_tag = post_dom.find('img', "wp-post-image")
        
        # Detect if the post has an actual image/src we can use (why not be too careful)
        has_image = False;
        if post_image_tag is not None:
            post_image_url = post_image_tag.attrs['data-lazy-src']
            if post_image_url is None:
                post_image_tag.attrs['src']
            # Set the flag
            if post_image_url is not None:
                has_image = True
        
        ### Now actually post to Facebook
        
        # The story does not have an image
        if has_image is False:
            graph.post(
                path = '668459723166194/feed',
                message = smpost.post_facebook,
                link = smpost.story_url,
                picture = "http://dailybruin.com/images/2013/01/dailybruinicon2.jpeg",
            )
        
        # The story has an image
        else:
            graph.post(
                path = '668459723166194/photos',
                message = smpost.post_facebook + "\n\nRead more: " + smpost.story_url,
                type= "photo",
                source = urllib2.urlopen(post_image_url),
            )

    def handle(self, *args, **options):
        # Get posts from the database
        posts = SMPost.objects.filter(
                pub_date__lte=datetime.now().date()
            ).filter(
                pub_time__lte=datetime.now().time()
            ).filter(
                pub_ready_copy=True
            ).filter(
                pub_ready_online=True
            ).exclude(
                sent=True
            )
        
        for post in posts:
            if post.post_facebook is not None:
                self.sendFacebookPost(post)
            if post.post_twitter is not None:
                self.sendTweet(post)
            post.sent = True
            post.save()
