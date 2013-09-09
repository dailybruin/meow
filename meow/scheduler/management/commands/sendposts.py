from django.core.management.base import BaseCommand, CommandError
from scheduler.models import *
import oauth2 as oauth
import time

class Command(BaseCommand):
    help = "Sends the appropriate social media posts"

    def handle(self, *args, **options):
        # Set the API endpoint 
        url = "https://api.twitter.com/1.1/statuses/update.json"

        # Set the base oauth_* parameters along with any other parameters required
        # for the API call.
        params = {
            'oauth_version': "1.0",
            'oauth_nonce': oauth.generate_nonce(),
            'oauth_timestamp': int(time.time()),
            'status': 'This is a test tweet',
            
        }

        # Set up instances of our Token and Consumer. The Consumer.key and 
        # Consumer.secret are given to you by the API provider. The Token.key and
        # Token.secret is given to you after a three-legged authentication.
        token = oauth.Token(key="1983491-iw1d2zJGS36EJ5Mq9wgPWQh4nCIWqfelmwaOfjQc", secret="8uZfKMoh7VjzkJJtjZO9RnPT8bftv0DKFyzfz31E")
        consumer = oauth.Consumer(key="OtVavzvwyUfOlETpDOg", secret="0wUHlrQSvB8GMHWDoCdFNjwrmDddug9AjUBjh2qE")

        # Set our token/key parameters
        params['oauth_token'] = token.key
        params['oauth_consumer_key'] = consumer.key

        # Create our request. Change method, etc. accordingly.
        req = oauth.Request(method="POST", url=url, parameters=params)

        # Sign the request.
        signature_method = oauth.SignatureMethod_HMAC_SHA1()
        req.sign_request(signature_method, consumer, token)
        
        client = oauth.Client(consumer, access_token)
        
        # Send the request
        resp, content = client.request(request_token_url, "GET")
        print resp
        print content
        