from django.core.management.base import BaseCommand, CommandError
from scheduler.models import *
import tweepy
import re
import io
from facepy import GraphAPI
from facepy.exceptions import *
from scheduler.models import *
from datetime import datetime, timedelta
from django.utils import timezone
import requests
from bs4 import BeautifulSoup
import HTMLParser

class Command(BaseCommand):
    help = "Sends the appropriate social media posts"

    def sendTweet(self, smpost, section, url, photo_url):
        try:
            print smpost.post_twitter.encode('ascii','ignore')
            CONSUMER_KEY = MeowSetting.objects.get(setting_key='twitter_consumer_key').setting_value
            CONSUMER_SECRET = MeowSetting.objects.get(setting_key='twitter_consumer_secret').setting_value
            ACCESS_KEY = section.twitter_access_key
            ACCESS_SECRET = section.twitter_access_secret

            auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
            auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
        
            api = tweepy.API(auth)
        
            # Make the tweet follow DB social media standards
            tweet = smpost.post_twitter

            if url is not None:
                tweet = tweet + " " + url

            if photo_url is not None:
                photo_source = requests.get(photo_url)
                filename = re.search("/([^/]*)$", photo_source.url).group(1)
                # io is needed to make an actual file object (tweepy requires
                # the seek method on the file object)
                photo_fd = io.BytesIO(photo_source.content)
                api.update_with_media(filename, tweet, file=photo_fd)
            else:
                api.update_status(status=tweet)
        
        except tweepy.TweepError as e:
            smpost.log_error(e, section, True)
        

    def sendFacebookPost(self, smpost, section, url, photo_url, fb_default_photo):
        try:
            print smpost.post_facebook.encode('ascii','ignore')
            #follow these steps: http://stackoverflow.com/questions/17620266/getting-a-manage-page-access-token-to-upload-events-to-a-facebook-page
            #Facebook needs the following permissions:
            # status_update, manage_pages
        
        
            # Initialize the Graph API with a valid access token (optional,
            # but will allow you to do all sorts of fun stuff).
        
            # Get token from here: https://developers.facebook.com/docs/opengraph/howtos/publishing-with-app-token/
            # appGraph = GraphAPI('72296391616|_vtz8ShgOfzLSgKeDw2quIS1pCc')
            GRAPH_KEY = section.facebook_key
            graph = GraphAPI(GRAPH_KEY) # This should not expire

            PAGE_ID = section.facebook_page_id

            ### Now actually post to Facebook
            
            if photo_url and url:
                graph.post(
                    path = PAGE_ID+'/photos',
                    message = smpost.post_facebook + "\n\nRead more: " + url,
                    type= "photo",
                    source = io.BytesIO(requests.get(photo_url).content),
                )
            elif photo_url:
                graph.post(
                    path = PAGE_ID+'/photos',
                    message = smpost.post_facebook,
                    type= "photo",
                    source = io.BytesIO(requests.get(photo_url).content),
                )
            elif url:
                graph.post(
                    path = PAGE_ID+'/feed',
                    message = smpost.post_facebook,
                    link = url,
                    picture = fb_default_photo,
                )
            else:
                graph.post(
                    path = PAGE_ID+'/feed',
                    message = smpost.post_facebook,
                )
        
        except (FacepyError, FacebookError, OAuthError, SignedRequestError, requests.exceptions.RequestException) as e:
            smpost.log_error(e, section, True)

    def handle(self, *args, **options):
        send_posts = MeowSetting.objects.get(setting_key="send_posts").setting_value
        if send_posts == "No" or send_posts == "no":
            print "Post sending is currently off!"
            return
            

        # Get posts from the database that are ready to send
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
            ).exclude(
                section=None
            )
        
        for post in posts:
            try:
                # Make sure nothing else is trying to send this post right now
                # This is not atomic; if meow ever scales a lot more, this will need to be re-written
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
                if (datetime.now() - send_date) > send_grace_period:
                    try: 
                        post.sending = False
                        post.log_error("Would have sent more than 20 minutes late.", post.section, True)
                        post.sending = False;        
                        post.sent = True
                        post.sent_time = timezone.now()
                        post.save()
                    except:
                        print "Something is very wrong2"
                        pass # But we can still try the rest of the posts that are going to be sent
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
                    fb_default_photo = MeowSetting.objects.get(setting_key='fb_default_photo').setting_value
                
                
                # Post to facebook
                if post.post_facebook:
                    # Section's account
                    if (post.section.facebook_page_id and post.section.facebook_key):
                        self.sendFacebookPost(post, post.section, send_url[1], photo_url, fb_default_photo)
                    # Also post to account
                    if (post.section.also_post_to and 
                        post.section.also_post_to.facebook_page_id and post.section.also_post_to.facebook_key):
                        self.sendFacebookPost(post, post.section.also_post_to, send_url[1], photo_url, fb_default_photo)
                # Post to twitter
                if post.post_twitter:
                    # Section's account
                    if (post.section.twitter_access_key and post.section.twitter_access_secret):
                        self.sendTweet(post, post.section, send_url[1], photo_url)
                    # Also post to account
                    if (post.section.also_post_to and 
                        post.section.also_post_to.twitter_access_key and post.section.also_post_to.twitter_access_secret):
                        self.sendTweet(post, post.section.also_post_to, send_url[1], photo_url)
            except:
                # Something wrong happened. Don't send this post.
                e = sys.exc_info()[0]
                post.log_error(e, post.section, True)
            
            # Now save whatever we changed to the post
            try:    
                post.sending = False;        
                post.sent = True
                post.sent_time = timezone.now()
                post.save()
            except:
                print "Something is very wrong"
                pass # But we can still try the rest of the posts that are going to be sent
