"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework.test import APIRequestFactory
from scheduler.models import SMPostTag
from scheduler.views import create_smpost_tags

from contextlib import ExitStack
from io import StringIO
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

        manager = get_user_model().objects.create_user(
            username="manager", selected_theme=None
        )
        content_type, _ = ContentType.objects.get_or_create(
            app_label="auth", model="user"
        )
        permission, _ = Permission.objects.get_or_create(
            content_type=content_type,
            codename="add_user",
            defaults={"name": "Can add user"},
        )
        manager.user_permissions.add(permission)
        self.client.force_login(
            manager, backend="django.contrib.auth.backends.ModelBackend"
        )

        session = self.client.session
        session["twitter_auth_token"] = {
            "oauth_token": "fake-request-token",
            "oauth_token_secret": "fake-request-secret",
        }
        session.save()

        self.stack = ExitStack()
        self.addCleanup(self.stack.close)

        self.oauth_handler = self.stack.enter_context(
            patch("scheduler.views.tweepy.OAuthHandler")
        ).return_value
        self.oauth_session = self.stack.enter_context(
            patch("scheduler.views.OAuth1Session")
        )
        self.oauth = self.oauth_session.return_value.__enter__.return_value
        self.credentials = {
            "oauth_token": "fake-access-token",
            "oauth_token_secret": "fake-access-secret",
            "screen_name": "dailybruin",
            "user_id": "12345",
        }
        self.oauth.fetch_access_token.return_value = self.credentials.copy()
        # A connection must not depend on a second API call for the handle.
        self.twitter_client = self.stack.enter_context(
            patch("scheduler.views.tweepy.Client")
        )

        self.stdout = self.stack.enter_context(
            patch("sys.stdout", new_callable=StringIO)
        )
        self.stderr = self.stack.enter_context(
            patch("sys.stderr", new_callable=StringIO)
        )

    def connect(self, **overrides):
        data = {
            "action": "connect",
            "section_id": self.section.pk,
            "verifier": "fake-verifier",
        }
        data.update(overrides)
        if data.get("section_id") is None:
            data.pop("section_id", None)
        return self.client.post("/api/v1/twitter-connect/", data)

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

    def assert_failed_without_saving(self, **overrides):
        with self.assertLogs("scheduler.views", level="ERROR") as logs:
            response = self.connect(**overrides)

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
        self.twitter_client.assert_not_called()

        self.assert_no_credentials(
            "\n".join(logs.output)
            + self.stdout.getvalue()
            + self.stderr.getvalue()
        )

    def test_success_saves_screen_name_and_tokens_from_exchange(self):
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
        self.oauth_session.assert_called_once_with(
            "fake-consumer-key",
            client_secret="fake-consumer-secret",
            resource_owner_key="fake-request-token",
            resource_owner_secret="fake-request-secret",
            verifier="fake-verifier",
        )
        self.oauth.fetch_access_token.assert_called_once_with(
            "https://api.twitter.com/oauth/access_token", timeout=15,
        )
        self.twitter_client.assert_not_called()
        self.oauth_handler.get_access_token.assert_not_called()
        logger.exception.assert_not_called()

        self.assert_no_credentials(
            self.stdout.getvalue()
            + self.stderr.getvalue()
            + str(logger.mock_calls)
        )

    def test_token_exchange_failure_saves_nothing(self):
        self.oauth.fetch_access_token.side_effect = RuntimeError(
            "OAuth exchange failed"
        )
        self.assert_failed_without_saving()
        self.oauth.fetch_access_token.assert_called_once_with(
            "https://api.twitter.com/oauth/access_token", timeout=15,
        )

    def test_invalid_section_does_not_consume_verifier(self):
        for section_id in (None, "", "not-an-id", self.section.pk + 1000):
            with self.subTest(section_id=section_id):
                self.assert_failed_without_saving(section_id=section_id)
                self.oauth_session.assert_not_called()
                self.oauth.fetch_access_token.assert_not_called()

    def test_incomplete_exchange_response_saves_nothing(self):
        for key in ("oauth_token", "oauth_token_secret", "screen_name"):
            for value in (None, ""):
                with self.subTest(key=key, value=value):
                    credentials = self.credentials.copy()
                    if value is None:
                        del credentials[key]
                    else:
                        credentials[key] = value
                    self.oauth.fetch_access_token.return_value = credentials
                    self.assert_failed_without_saving()

    def test_redirect_builds_canonical_callback(self):
        MeowSetting.objects.create(
            setting_key="site_url", setting_value="http://localhost:5000/"
        )
        self.oauth_handler.get_authorization_url.return_value = "https://example.com/authorize"
        self.oauth_handler.request_token = {"oauth_token": "fake-request-token"}
        with patch("scheduler.views.tweepy.OAuthHandler", return_value=self.oauth_handler) as handler:
            response = self.client.get("/api/v1/twitter-redir/")
        self.assertRedirects(
            response, "https://example.com/authorize", fetch_redirect_response=False
        )
        handler.assert_called_once_with(
            "fake-consumer-key", "fake-consumer-secret",
            callback="http://localhost:5000/api/v1/twitter-connect/",
        )
