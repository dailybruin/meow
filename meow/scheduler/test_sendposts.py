"""Characterize sendposts; known scheduling bugs stay as expected failures."""

import unittest
from contextlib import ExitStack
from datetime import datetime, timedelta
from unittest.mock import call, patch

import pytz
from django.test import TestCase, override_settings
from django.utils import timezone

from scheduler.management.commands.sendposts import Command
from scheduler.models import MeowSetting, Section, SMPost


@override_settings(
    TIME_ZONE="America/Los_Angeles",
    USE_TZ=True,
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
)
class SendPostsTest(TestCase):
    def setUp(self):
        self.stack = ExitStack()
        self.addCleanup(self.stack.close)
        self.local_zone = pytz.timezone("America/Los_Angeles")
        self.stack.enter_context(timezone.override(self.local_zone))
        self.now = self.local_zone.localize(datetime(2026, 2, 10, 12, 0))
        self.clock = self.stack.enter_context(
            patch("django.utils.timezone.now", return_value=self.now)
        )
        self.send_command = self.stack.enter_context(
            patch(
                "scheduler.management.commands.sendposts.call_command",
                return_value=None,
            )
        )
        self.http = self.stack.enter_context(
            patch(
                "requests.sessions.Session.request",
                side_effect=AssertionError("sendposts tests must not make HTTP calls"),
            )
        )
        self.addCleanup(self.http.assert_not_called)
        self.stack.enter_context(
            patch("scheduler.management.commands.sendposts.logger")
        )
        self.stack.enter_context(patch("scheduler.models.logger"))

        self.send_setting = MeowSetting.objects.create(
            setting_key="send_posts", setting_value="Yes"
        )
        self.section = Section.objects.create(
            name="Test section",
            facebook_page_id="fake-facebook-page",
            facebook_key="fake-facebook-token",
            facebook_default_photo="https://example.invalid/default.jpg",
            twitter_access_key="fake-twitter-key",
            twitter_access_secret="fake-twitter-secret",
        )

    def make_post(self, **overrides):
        scheduled = self.now - timedelta(minutes=5)
        fields = {
            "slug": "sendposts-test",
            "pub_date": scheduled.date(),
            "pub_time": scheduled.time(),
            "pub_ready_copy": True,
            "pub_ready_online": True,
            "is_active": True,
            "section": self.section,
            "post_facebook": "Test Facebook copy",
            "post_twitter": "Test X copy",
            "story_url": "",
        }
        fields.update(overrides)
        return SMPost.objects.create(**fields)

    def run_sendposts(self):
        Command().handle()

    def assert_post_sent(self, post):
        self.assertEqual(self.send_command.call_args_list, [
            call(
                "sendfacebook",
                smpost=post,
                section=self.section,
                url=None,
                fb_default_photo=self.section.facebook_default_photo,
            ),
            call("sendtweet", smpost=post, section=self.section, url=None),
        ])
        post.refresh_from_db()
        self.assertTrue(post.sent)
        self.assertFalse(post.sending)
        self.assertFalse(post.sent_error)
        self.assertFalse(post.send_now)
        self.assertEqual(post.sent_time, self.clock.return_value)

    def assert_post_ignored(self, **overrides):
        post = self.make_post(**overrides)
        original = (post.sent, post.sending, post.sent_error, post.sent_time)
        self.run_sendposts()
        self.send_command.assert_not_called()
        post.refresh_from_db()
        self.assertEqual(
            (post.sent, post.sending, post.sent_error, post.sent_time), original
        )

    def test_ready_due_post_is_sent(self):
        post = self.make_post()
        self.run_sendposts()
        self.assert_post_sent(post)

    def test_post_not_copy_edited_is_ignored(self):
        self.assert_post_ignored(pub_ready_copy=False)

    def test_post_not_online_ready_is_ignored(self):
        self.assert_post_ignored(pub_ready_online=False)

    def test_inactive_post_is_ignored(self):
        self.assert_post_ignored(is_active=False)

    def test_post_without_section_is_ignored(self):
        self.assert_post_ignored(section=None)

    def test_already_sent_post_is_ignored(self):
        self.assert_post_ignored(sent=True)

    def test_already_sending_post_is_ignored(self):
        self.assert_post_ignored(sending=True)

    def test_send_now_post_is_sent_before_scheduled_time(self):
        future = self.now + timedelta(hours=1)
        post = self.make_post(
            pub_date=future.date(), pub_time=future.time(), send_now=True
        )
        self.run_sendposts()
        self.assert_post_sent(post)

    def test_send_posts_setting_no_disables_sending(self):
        self.send_setting.setting_value = "No"
        self.send_setting.save(update_fields=["setting_value"])
        self.assert_post_ignored()

    def test_post_61_minutes_late_is_marked_sent_with_error_without_posting(self):
        scheduled = self.now - timedelta(minutes=61)
        post = self.make_post(pub_date=scheduled.date(), pub_time=scheduled.time())
        self.run_sendposts()
        self.send_command.assert_not_called()
        post.refresh_from_db()
        self.assertTrue(post.sent)
        self.assertTrue(post.sent_error)
        self.assertFalse(post.sending)
        self.assertEqual(post.sent_time, self.now)
        self.assertIn("Would have sent more than 60 minutes late.", post.sent_error_text)


    @unittest.expectedFailure
    def test_post_at_2359_yesterday_is_sent_at_000030_today(self):
        self.clock.return_value = self.local_zone.localize(
            datetime(2026, 2, 11, 0, 0, 30)
        )
        post = self.make_post(
            pub_date=datetime(2026, 2, 10).date(),
            pub_time=datetime(2026, 2, 10, 23, 59).time(),
        )
        self.run_sendposts()
        self.assert_post_sent(post)

    @unittest.expectedFailure
    def test_post_at_2350_yesterday_is_sent_at_0020_today(self):
        self.clock.return_value = self.local_zone.localize(
            datetime(2026, 2, 11, 0, 20)
        )
        post = self.make_post(
            pub_date=datetime(2026, 2, 10).date(),
            pub_time=datetime(2026, 2, 10, 23, 50).time(),
        )
        self.run_sendposts()
        self.assert_post_sent(post)

    @unittest.expectedFailure
    def test_post_in_spring_dst_gap_is_sent_at_0310(self):
        self.clock.return_value = self.local_zone.localize(
            datetime(2026, 3, 8, 3, 10), is_dst=None
        )
        post = self.make_post(
            pub_date=datetime(2026, 3, 8).date(),
            pub_time=datetime(2026, 3, 8, 2, 30).time(),
        )
        self.run_sendposts()
        self.assert_post_sent(post)

    @unittest.expectedFailure
    def test_post_in_repeated_fall_dst_hour_is_sent_at_0145(self):
        # Use the second 01:45 (PST); the scheduled naive 01:30 is ambiguous.
        self.clock.return_value = self.local_zone.localize(
            datetime(2026, 11, 1, 1, 45), is_dst=False
        )
        post = self.make_post(
            pub_date=datetime(2026, 11, 1).date(),
            pub_time=datetime(2026, 11, 1, 1, 30).time(),
        )
        self.run_sendposts()
        self.assert_post_sent(post)
