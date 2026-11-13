"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase, override_settings
from rest_framework.test import APIRequestFactory
from scheduler.models import SMPostTag
from scheduler.views import create_smpost_tags

from contextlib import ExitStack
from io import StringIO
from types import SimpleNamespace
from unittest.mock import patch

from scheduler.models import MeowSetting, Section
from django.utils.html import escape


factory = APIRequestFactory()

class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)

class SMPostTagTest(TestCase):
    def test_creating_tags(self):
        [x.delete() for x in SMPostTag.objects.all()]
        request = factory.post('tags/create-many', {"tag1":"tag1", "tag2":"tag2"})
        create_smpost_tags(request)
        # now check that the 2 tags have been created.
        self.assertEqual(SMPostTag.objects.count(), 2)


@override_settings(
    STATICFILES_STORAGE="django.contrib.staticfiles.storage.StaticFilesStorage"
)
class TwitterConnectTest(TestCase):
    def setUp(self):
        settings = {
            "site_message": "",
            "send_posts": "False",
            "twitter_consumer_key": "fake-consumer-key",
            "twitter_consumer_secret": "fake-consumer-secret",
        }
        for key, value in settings.items():
            MeowSetting.objects.update_or_create(
                setting_key=key,
                defaults={"setting_value": value},
            )

        self.section = Section.objects.create(
            name="Test",
            twitter_account_handle="old_handle",
            twitter_access_key="old-key",
            twitter_access_secret="old-secret",
        )

        session = self.client.session
        session["twitter_auth_token"] = {
            "oauth_token": "fake-request-token",
            "oauth_token_secret": "fake-request-secret",
        }
        session.save()

        self.stack = ExitStack()
        self.addCleanup(self.stack.close)

        self.oauth = self.stack.enter_context(
            patch("scheduler.views.tweepy.OAuthHandler")
        ).return_value
        self.oauth.access_token = "fake-access-token"
        self.oauth.access_token_secret = "fake-access-secret"

        self.api = self.stack.enter_context(
            patch("scheduler.views.tweepy.Client")
        ).return_value
        self.api.get_me.return_value = SimpleNamespace(
            data=SimpleNamespace(
                username="dailybruin",
                name="Daily Bruin",
            )
        )

        self.stdout = self.stack.enter_context(
            patch("sys.stdout", new_callable=StringIO)
        )
        self.stderr = self.stack.enter_context(
            patch("sys.stderr", new_callable=StringIO)
        )

    def connect(self, path="/api/v1/twitter-connect/"):
        return self.client.post(path, {
            "action": "connect",
            "section_id": self.section.pk,
            "verifier": "fake-verifier",
        })

    def assert_no_credentials(self, output):
        for value in [
            "fake-consumer-key",
            "fake-consumer-secret",
            "fake-request-token",
            "fake-request-secret",
            "fake-access-token",
            "fake-access-secret",
            "fake-verifier",
        ]:
            self.assertNotIn(value, output)

    def assert_failed_without_saving(self):
        with self.assertLogs("scheduler.views", level="ERROR") as logs:
            response = self.connect()

        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "twit-connect.html")
        self.assertContains(
            response,
            escape("Couldn't connect to your account"),
        )
        self.assertTrue(
            any(record.exc_info for record in logs.records),
            "Expected an exception traceback in the log",
        )

        self.section.refresh_from_db()
        self.assertEqual(
            self.section.twitter_account_handle, "old_handle"
        )
        self.assertEqual(self.section.twitter_access_key, "old-key")
        self.assertEqual(self.section.twitter_access_secret, "old-secret")
        self.assertNotIn("message", self.client.session)

        self.assert_no_credentials(
            "\n".join(logs.output)
            + self.stdout.getvalue()
            + self.stderr.getvalue()
        )

    def test_success_saves_username_and_tokens(self):
        with patch("scheduler.views.logger") as logger:
            response = self.connect()

        self.assertRedirects(
            response, "/", fetch_redirect_response=False
        )
        self.section.refresh_from_db()
        self.assertEqual(
            self.section.twitter_account_handle, "dailybruin"
        )
        self.assertEqual(
            self.section.twitter_access_key, "fake-access-token"
        )
        self.assertEqual(
            self.section.twitter_access_secret, "fake-access-secret"
        )
        self.assertIn("@dailybruin", self.client.session["message"])
        self.oauth.get_access_token.assert_called_once_with("fake-verifier")
        self.api.get_me.assert_called_once_with()
        logger.exception.assert_not_called()

        self.assert_no_credentials(
            self.stdout.getvalue()
            + self.stderr.getvalue()
            + str(logger.mock_calls)
        )

    def test_token_exchange_failure_saves_nothing(self):
        self.oauth.get_access_token.side_effect = RuntimeError(
            "OAuth exchange failed"
        )
        self.assert_failed_without_saving()
        self.api.get_me.assert_not_called()

    def test_profile_lookup_failure_saves_nothing(self):
        self.api.get_me.side_effect = RuntimeError(
            "Profile lookup failed"
        )
        self.assert_failed_without_saving()

    def test_legacy_callback_shows_section_selector(self):
        response = self.client.get("/manage/twitter-connect/", {
            "oauth_token": "fake-request-token",
            "oauth_verifier": "fake-verifier",
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "twit-connect.html")
        self.assertContains(response, "Choose a section")
        self.oauth.get_access_token.assert_not_called()
        self.section.refresh_from_db()
        self.assertEqual(self.section.twitter_access_key, "old-key")

    def test_legacy_callback_saves_connection(self):
        response = self.connect("/manage/twitter-connect/")
        self.assertRedirects(response, "/", fetch_redirect_response=False)
        self.section.refresh_from_db()
        self.assertEqual(self.section.twitter_account_handle, "dailybruin")
        self.assertEqual(self.section.twitter_access_key, "fake-access-token")
        self.assertEqual(self.section.twitter_access_secret, "fake-access-secret")

    def test_redirect_builds_canonical_callback(self):
        MeowSetting.objects.create(
            setting_key="site_url", setting_value="http://localhost:5000/"
        )
        self.oauth.get_authorization_url.return_value = "https://example.com/authorize"
        self.oauth.request_token = {"oauth_token": "fake-request-token"}
        with patch("scheduler.views.tweepy.OAuthHandler", return_value=self.oauth) as handler:
            response = self.client.get("/api/v1/twitter-redir/")
        self.assertRedirects(
            response, "https://example.com/authorize", fetch_redirect_response=False
        )
        handler.assert_called_once_with(
            "fake-consumer-key", "fake-consumer-secret",
            callback="http://localhost:5000/api/v1/twitter-connect/",
        )
