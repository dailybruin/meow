from contextlib import ExitStack
from urllib.parse import urlencode
from unittest.mock import patch

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponse
from django.shortcuts import resolve_url
from django.test import TestCase, override_settings

from scheduler.models import MeowSetting, Section


@override_settings(
    STATICFILES_STORAGE="django.contrib.staticfiles.storage.StaticFilesStorage"
)
class TwitterPermissionsTest(TestCase):
    def setUp(self):
        for key, value in {
            "site_message": "",
            "send_posts": "No",
            "twitter_consumer_key": "fake-consumer-key",
            "twitter_consumer_secret": "fake-consumer-secret",
            "site_url": "http://localhost:5000/",
            "fb_app_id": "fake-facebook-id",
            "fb_app_secret": "fake-facebook-secret",
        }.items():
            MeowSetting.objects.create(setting_key=key, setting_value=value)

        self.section = Section.objects.create(
            name="Test",
            twitter_access_key="existing-key",
            twitter_access_secret="existing-secret",
            twitter_account_handle="existing_handle",
        )
        self.manager = get_user_model().objects.create_user(
            username="manager", selected_theme=None
        )
        self.editor = get_user_model().objects.create_user(
            username="editor", selected_theme=None
        )
        content_type, _ = ContentType.objects.get_or_create(
            app_label="auth", model="user"
        )
        permission, _ = Permission.objects.get_or_create(
            content_type=content_type,
            codename="add_user",
            defaults={"name": "Can add user"},
        )
        self.manager.user_permissions.add(permission)

        session = self.client.session
        session["twitter_auth_token"] = {
            "oauth_token": "in-progress-token",
            "oauth_token_secret": "in-progress-secret",
        }
        session.save()

        self.stack = ExitStack()
        self.addCleanup(self.stack.close)
        self.handler = self.stack.enter_context(
            patch("scheduler.views.tweepy.OAuthHandler")
        )
        self.handler.return_value.get_authorization_url.return_value = (
            "https://example.invalid/authorize"
        )
        self.handler.return_value.request_token = {
            "oauth_token": "new-request-token",
            "oauth_token_secret": "new-request-secret",
        }
        self.oauth_session = self.stack.enter_context(
            patch("scheduler.views.OAuth1Session")
        )
        self.exchange = (
            self.oauth_session.return_value.__enter__.return_value.fetch_access_token
        )
        self.exchange.return_value = {
            "oauth_token": "new-access-token",
            "oauth_token_secret": "new-access-secret",
            "screen_name": "dailybruin",
        }
        self.http = self.stack.enter_context(
            patch(
                "requests.sessions.Session.request",
                side_effect=AssertionError("Permission tests must not make HTTP calls"),
            )
        )
        self.addCleanup(self.http.assert_not_called)

    def login_as(self, user):
        self.client.force_login(
            user, backend="django.contrib.auth.backends.ModelBackend"
        )

    def assert_rejected_without_changes(self, method, path):
        original_section = Section.objects.values().get(pk=self.section.pk)
        original_session = dict(self.client.session)
        original_settings = list(MeowSetting.objects.order_by("pk").values())
        if method == "POST":
            response = self.client.post(path, {
                "action": "connect",
                "section_id": self.section.pk,
                "verifier": "fake-verifier",
            })
        else:
            response = self.client.get(path)
        expected_url = "{}?{}".format(
            resolve_url(settings.LOGIN_URL), urlencode({"next": path})
        )
        self.assertRedirects(response, expected_url, fetch_redirect_response=False)
        self.assertEqual(
            Section.objects.values().get(pk=self.section.pk), original_section
        )
        self.assertEqual(dict(self.client.session), original_session)
        self.assertEqual(
            list(MeowSetting.objects.order_by("pk").values()), original_settings
        )
        self.handler.assert_not_called()
        self.oauth_session.assert_not_called()

    def test_logged_out_twitter_redirect_requires_login(self):
        self.assert_rejected_without_changes("GET", "/api/v1/twitter-redir/")

    def test_logged_out_connect_get_requires_login(self):
        self.assert_rejected_without_changes("GET", "/api/v1/twitter-connect/")

    def test_logged_out_connect_post_requires_login(self):
        self.assert_rejected_without_changes("POST", "/api/v1/twitter-connect/")

    def test_logged_in_user_can_complete_oauth_connection(self):
        # Any logged-in staffer may connect; no manage permission is needed.
        self.login_as(self.editor)
        response = self.client.get("/api/v1/twitter-redir/")
        self.assertRedirects(
            response, "https://example.invalid/authorize",
            fetch_redirect_response=False,
        )
        self.handler.assert_called_once_with(
            "fake-consumer-key", "fake-consumer-secret",
            callback="http://localhost:5000/api/v1/twitter-connect/",
        )
        response = self.client.get("/api/v1/twitter-connect/", {
            "oauth_token": "new-request-token", "oauth_verifier": "fake-verifier",
        })
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, "twit-connect.html")
        self.assertContains(response, "Choose a section")
        self.exchange.assert_not_called()
        response = self.client.post("/api/v1/twitter-connect/", {
            "action": "connect", "section_id": self.section.pk,
            "verifier": "fake-verifier",
        })
        self.assertRedirects(response, "/", fetch_redirect_response=False)
        self.oauth_session.assert_called_once_with(
            "fake-consumer-key", client_secret="fake-consumer-secret",
            resource_owner_key="new-request-token",
            resource_owner_secret="new-request-secret", verifier="fake-verifier",
        )
        self.exchange.assert_called_once_with(
            "https://api.twitter.com/oauth/access_token", timeout=15,
        )
        self.section.refresh_from_db()
        self.assertEqual(self.section.twitter_access_key, "new-access-token")
        self.assertEqual(self.section.twitter_access_secret, "new-access-secret")
        self.assertEqual(self.section.twitter_account_handle, "dailybruin")

    def load_manage(self):
        with patch("scheduler.views.render", return_value=HttpResponse("Manage")) as render:
            response = self.client.get("/api/v1/manage/")
        self.assertEqual(response.status_code, 200)
        render.assert_called_once()
        self.assertEqual(render.call_args.args[1], "scheduler/manage.html")
        return render.call_args.args[2]

    def test_manage_makes_no_x_request_and_has_no_twitter_authorization_url(self):
        self.login_as(self.manager)
        context = self.load_manage()
        self.handler.assert_not_called()
        self.oauth_session.assert_not_called()
        self.assertNotIn("twitter_auth_url", context)

    def test_manage_preserves_in_progress_twitter_token(self):
        self.login_as(self.manager)
        original_token = self.client.session["twitter_auth_token"].copy()
        self.load_manage()
        self.assertEqual(self.client.session["twitter_auth_token"], original_token)

    def test_manage_does_not_create_twitter_token(self):
        self.login_as(self.manager)
        session = self.client.session
        del session["twitter_auth_token"]
        session.save()
        self.load_manage()
        self.assertNotIn("twitter_auth_token", self.client.session)
