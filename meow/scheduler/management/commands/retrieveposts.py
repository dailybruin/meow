from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.utils import timezone
from django.conf import settings

from facepy import GraphAPI
from facepy.exceptions import FacepyError

from datetime import datetime, timedelta
import time
import logging

from decimal import Decimal

from scheduler.models import MeowSetting, SMPost

logger = logging.getLogger('scheduler')


class Command(BaseCommand):
    help = "Retrieve the already sent meows"
    engagement_time = timedelta(days=365)

    def handle(self, *args, **options):
        # Get sent posts from the database that fit the datetime range
        current_date = timezone.localtime(timezone.now()).date()
        start_date = current_date-self.engagement_time
        engagement_start_datetime = timezone.localtime(
            timezone.now()) - self.engagement_time
        print(engagement_start_datetime)
        # Filter to obtain the sent posts within the engagement_time
        engaged_posts = SMPost.objects.filter(
            pub_date__range=(start_date, current_date)
        ).exclude(
            sending=True
        ).exclude(
            sent=False
        )

        sections_tracker_for_facebook = dict()
        posts_tracker_for_facebook = dict()
        # classify the posts by section
        for post in engaged_posts:
            if post.id_facebook != 0:
                posts_tracker_for_facebook[str(post.id_facebook)] = False
                facebook_section_config = (
                    post.section.facebook_key, post.section.facebook_page_id)
                if facebook_section_config not in sections_tracker_for_facebook:
                    facebook_section_config = (
                        post.section.facebook_key, post.section.facebook_page_id)
                    sections_tracker_for_facebook[facebook_section_config] = 1
                else:
                    continue

        for section in sections_tracker_for_facebook:
            GRAPH_KEY = section[0]
            graph = GraphAPI(GRAPH_KEY)
            PAGE_ID = section[1]
            query_string = PAGE_ID + \
                '/feed?fields=comments.summary(true).limit(0),likes.summary(true),created_time&limit=10&date_format=U'
            reached_end = False
            while(not reached_end):
                try:
                    res = graph.get(query_string)
                except Exception as e:
                    print(e)
                if res:
                    print(res)
                    for post in res['data']:
                        post_creation_time = post['created_time']
                        post_creation_datetime = timezone.make_aware(datetime.fromtimestamp(
                            post_creation_time))
                        if post_creation_datetime > engagement_start_datetime:
                            facebook_page_post_id = post['id'].split('_')
                            facebook_post_id = Decimal(
                                facebook_page_post_id[1])
                            selected_post = SMPost.objects.all().filter(
                                id_facebook=facebook_post_id)
                            if facebook_post_id in posts_tracker_for_facebook:
                                posts_tracker_for_facebook[facebook_post_id] = True
                            if len(selected_post) == 1:
                                found_post = selected_post[0]
                                updated_likes = post['likes']['summary']['total_count']
                                updated_comments = post['comments']['summary']['total_count']
                                if 'shares' in post:
                                    updated_shares = post['shares']['count']
                                    found_post.post_facebook_shares = updated_shares
                                found_post.post_facebook_likes = updated_likes
                                found_post.post_facebook_comments = updated_comments
                                found_post.save()
                        else:
                            print('earlier')
                            reached_end = True
                            break
                    if reached_end:
                        break
                    if 'paging' in res:
                        if 'next' in res['paging']:
                            next_page_query_string = res['paging']['next']
                            query_string_start_pos = next_page_query_string .find(
                                PAGE_ID)
                            query_string = next_page_query_string[query_string_start_pos:]
                    else:
                        break
        for post in posts_tracker_for_facebook:
            # for posts that are not updated, we know that they are no longer present on the page and we should remove them from the statistics
            if posts_tracker_for_facebook[post] == False:
                # current post in an inactive post
                found_post = SMPost.objects.get(
                    id_facebook=Decimal(post))
                if found_post:
                    found_post.id_facebook = 0
                    found_post.post_facebook_comments = None
                    found_post.post_facebook_likes = None
                    found_post.post_facebook_shares = None
                    found_post.save()
