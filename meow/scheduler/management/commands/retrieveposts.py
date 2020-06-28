from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.utils import timezone
from django.conf import settings

from facepy import GraphAPI
from facepy.exceptions import FacepyError

from datetime import datetime, timedelta
import time
import logging

from scheduler.models import MeowSetting, SMPost

logger = logging.getLogger('scheduler')


class Command(BaseCommand):
    help = "Retrieve the already sent meows"
    engagement_time = timedelta(days=14)

    def handle(self, *args, **options):
        # Get sent posts from the database that fit the datetime range
        current_date = timezone.localtime(timezone.now()).date()
        start_date = current_date-self.engagement_time
        # Filter to obtain the sent posts within the engagement_time
        engaged_posts = SMPost.objects.filter(
            pub_date__range=(start_date, current_date)
        ).exclude(
            sending=True
        ).exclude(
            sent=False
        )

        section_posts_tracker_for_facebook = dict()

        for post in engaged_posts:
            if post.id_facebook != 0:
                facebook_section_config = (
                    post.section.facebook_key, post.section.facebook_page_id)
                if facebook_section_config not in section_posts_tracker_for_facebook:
                    facebook_section_config = (
                        post.section.facebook_key, post.section.facebook_page_id)
                    section_posts_tracker_for_facebook[facebook_section_config] = [
                        post.id_facebook]
                else:
                    section_posts_tracker_for_facebook[facebook_section_config].append(
                        post.id_facebook)
        print(section_posts_tracker_for_facebook)
        for section in section_posts_tracker_for_facebook:
            GRAPH_KEY = section[0]
            graph = GraphAPI(GRAPH_KEY)
            PAGE_ID = section[1]
            print(section_posts_tracker_for_facebook[section])
            num_posts_to_fetch = len(
                section_posts_tracker_for_facebook[section])
            query_string = PAGE_ID + \
                '1734367910191247/feed?fields=comments.summary(true).limit(0),likes.summary(true)&limit={0}'.format(
                    num_posts_to_fetch)
            try:
                res = graph.get(query_string)
            except Exception as e:
                print(e)

            if res:
                print(res)
