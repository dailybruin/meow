from scheduler.models import MeowSetting
from requests_oauthlib import OAuth2Session
from requests_oauthlib.compliance_fixes import facebook_compliance_fix
import tweepy 
from facepy import GraphAPI
import json


def get_analytics(smposts):
    post_data = {}
    posts_data = []

    for post in smposts:
        section = post.section
        
        # authorize Twitter
        tw_id = post.id_twitter
        tw_retweet = 0
        tw_fav = 0
        if tw_id != 0:
            CONSUMER_KEY = MeowSetting.objects.get(
                setting_key='twitter_consumer_key').setting_value
            CONSUMER_SECRET = MeowSetting.objects.get(
                setting_key='twitter_consumer_secret').setting_value
            ACCESS_KEY = section.twitter_access_key
            ACCESS_SECRET = section.twitter_access_secret

            auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
            auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)

            twitter_api = tweepy.API(auth)

            tweet = twitter_api.get_status(tw_id)
            tw_retweet = tweet.retweet_count
            tw_fav = tweet.favorite_count

        # authorize Facebook
        fb_id = post.id_facebook
        fb_reactions = 0
        if fb_id != 0:
            GRAPH_KEY = section.facebook_key
            graph = GraphAPI(GRAPH_KEY)  # This should not expire
            PAGE_ID = section.facebook_page_id

            data_reactions = graph.get('{0}_{1}/reactions?summary=total_count'.format(PAGE_ID, fb_id))
            fb_reactions = data_reactions['summary']['total_count']

        post_data = {
            "retweet_count": tw_retweet,
            "favorite_count": tw_fav,
            "reactions_count": fb_reactions
        }
        posts_data.append(post_data)

    return posts_data



