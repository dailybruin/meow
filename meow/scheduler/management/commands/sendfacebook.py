from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.utils import timezone
from django.conf import settings

from datetime import datetime, timedelta
from facepy import GraphAPI
from facepy.exceptions import FacepyError
import re
import io
import requests
import json
import sys
import time
import traceback

from scheduler.models import MeowSetting, SMPost

class Command(BaseCommand):
    help = "Sends the appropriate Facebook post"

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
        parser.add_argument(
            '--fb_default_photo', default=None,
            help="URL to photo to display on Facebook.")


    def handle(self, *args, **options):
        smpost = options.get('smpost', None)
        section = options.get('section', None)
        url = options.get('url', None)
        photo_url = options.get('photo_url', None)
        fb_default_photo = options.get('fb_default_photo', None)

        try:
            print('Sending FB: {}'.format(smpost.post_facebook))
            # follow these steps: http://stackoverflow.com/questions/17620266/getting-a-manage-page-access-token-to-upload-events-to-a-facebook-page
            # Facebook needs the following permissions:
            # status_update, manage_pages

            # Initialize the Graph API with a valid access token (optional,
            # but will allow you to do all sorts of fun stuff).

            # Get token from here: https://developers.facebook.com/docs/opengraph/howtos/publishing-with-app-token/
            # appGraph = GraphAPI('72296391616|_vtz8ShgOfzLSgKeDw2quIS1pCc')
            GRAPH_KEY = section.facebook_key
            graph = GraphAPI(GRAPH_KEY)  # This should not expire

            PAGE_ID = section.facebook_page_id

            data = {
                "path": PAGE_ID + '/feed',
                "message": smpost.post_facebook,
            }
            if photo_url:
                data['picture'] = photo_url
            else:
                data['picture'] = fb_default_photo
            
            if url:
                data['link'] = url

            errors = 0
            res = None
            while errors < 2:
                try:
                    res = graph.post(**data)
                    break
                except Exception as e:
                    smpost.log("Facebook Errored - #%d attempt. Msg:\n %s \n Traceback:\n %s" % (errors, e, traceback.format_exc()))
                    if errors >= 2:
                        raise Exception
                        break
                    else:
                        time.sleep(0.5)
                        errors += 1

            print("----------------------")
            post_id = res['id'].split('_')[1]
            print("Successfully posted to FB at ID: %s" % post_id)

            # Add the id for the post to the database
            smpost.id_facebook = post_id
            smpost.save()

            return "https://facebook.com/{}".format(post_id)

        except (FacepyError) as e:
            smpost.log(traceback.format_exc())
            smpost.log_error(e, section, True)
            slack_data = {
                "text": ":sadparrot: *{}* has errored at {}"
                .format(smpost.slug, timezone.now().strftime("%A, %d. %B %Y %I:%M%p")),
                "attachments": [{"color": "danger", "title": "Facebook Error", "text": str(e)}]
            }

            requests.post(settings.SLACK_ENDPOINT,
                          data=json.dumps(slack_data),
                          headers={'Content-Type': 'application/json'})