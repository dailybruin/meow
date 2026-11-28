from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from scheduler.models import PostHistory, SMPost


class SMPostAPITest(APITestCase):
    SEND_STATE = {
        "sent": (False, True),
        "sending": (False, True),
        "sent_time": (None, "2025-01-10T18:30:00Z"),
        "sent_error": (False, True),
        "sent_error_text": (None, "Client-supplied send error"),
        "send_now": (False, True),
        "id_twitter": (0, "12345678901234567890"),
        "id_facebook": (0, "98765432109876543210"),
    }

    @classmethod
    def setUpTestData(cls):
        copy_group, _ = Group.objects.get_or_create(name="Copy")
        online_group, _ = Group.objects.get_or_create(name="Online")
        cls.editor = cls.create_user("editor")
        cls.approver = cls.create_user("approver", copy_group, online_group)
        cls.copy_editor = cls.create_user("copy-editor", copy_group)
        cls.online_editor = cls.create_user("online-editor", online_group)

    @staticmethod
    def create_user(username, *groups):
        user = get_user_model().objects.create_user(
            username=username, selected_theme=None
        )
        user.groups.add(*groups)
        return user

    def authenticate(self, user):
        self.client.force_authenticate(user=user)

    @staticmethod
    def valid_payload(**changes):
        return {
            "slug": "campus-story",
            "story_url": "https://example.com/campus-story",
            "post_twitter": "Original story caption",
            **changes,
        }

    def create_post(self, **fields):
        return SMPost.objects.create(
            **self.valid_payload(last_edit_user=self.approver, **fields)
        )

    def post(self, **changes):
        return self.client.post(
            reverse("scheduler:post-list"), self.valid_payload(**changes), format="json"
        )

    def put(self, post, **changes):
        payload = self.valid_payload(
            slug=post.slug,
            story_url=post.story_url,
            post_twitter=post.post_twitter,
            version_number=post.version_number,
        )
        payload.update(changes)
        # The detail and Send Now routes share the same URL name.
        return self.client.put(
            f"{reverse('scheduler:post-list')}{post.pk}",
            payload,
            format="json",
        )

    def assert_status(self, response, expected):
        self.assertEqual(
            response.status_code, expected, getattr(response, "data", response)
        )

    def assert_approval_error(self, response):
        with self.subTest(check="approval status"):
            self.assert_status(response, status.HTTP_403_FORBIDDEN)
        with self.subTest(check="approval message"):
            self.assertIsInstance(response.data, dict)
            self.assertIsInstance(response.data.get("error"), str)
            self.assertTrue(response.data["error"].strip())

    def assert_approvals(self, post, *, copy_user=None, online_user=None):
        post.refresh_from_db()
        self.assertEqual(post.pub_ready_copy, copy_user is not None, "Copy flag")
        self.assertEqual(post.pub_ready_copy_user, copy_user, "Copy approver")
        self.assertEqual(post.pub_ready_online, online_user is not None, "Online flag")
        self.assertEqual(post.pub_ready_online_user, online_user, "Online approver")

    @staticmethod
    def post_state(post):
        return {
            "fields": SMPost.objects.filter(pk=post.pk).values().get(),
            "tags": list(post.tags.order_by("pk").values_list("pk", flat=True)),
            "history": list(
                PostHistory.objects.filter(smpost=post).order_by("pk").values()
            ),
        }

    # Read-only send state

    def test_put_ignores_send_state_and_saves_ordinary_edit(self):
        self.authenticate(self.editor)
        for field, (_, supplied) in self.SEND_STATE.items():
            with self.subTest(field=field):
                post = self.create_post()
                original = getattr(post, field)
                response = self.put(post, slug="updated-story", **{field: supplied})
                self.assert_status(response, status.HTTP_200_OK)
                post.refresh_from_db()
                self.assertEqual(post.slug, "updated-story")
                self.assertEqual(getattr(post, field), original, field)

    def test_post_ignores_supplied_send_state(self):
        self.authenticate(self.editor)
        for field, (default, supplied) in self.SEND_STATE.items():
            with self.subTest(field=field):
                response = self.post(**{field: supplied})
                self.assert_status(response, status.HTTP_201_CREATED)
                post = SMPost(pk=response.data["id"])
                post.refresh_from_db()
                self.assertEqual(post.slug, "campus-story")
                self.assertEqual(getattr(post, field), default, field)

    # Creation approval permissions

    def test_post_rejects_approvals_without_required_groups(self):
        cases = (
            (self.editor, True, False),
            (self.editor, False, True),
            (self.editor, True, True),
            (self.copy_editor, False, True),
            (self.online_editor, True, False),
        )
        for user, copy, online in cases:
            with self.subTest(user=user.username, copy=copy, online=online):
                self.authenticate(user)
                existing = SMPost.objects.count()
                response = self.post(pub_ready_copy=copy, pub_ready_online=online)
                self.assert_approval_error(response)
                self.assertEqual(SMPost.objects.count(), existing, "Post was created")

    def test_post_allows_unapproved_draft_without_groups(self):
        self.authenticate(self.editor)
        response = self.post(pub_ready_copy=False, pub_ready_online=False)
        self.assert_status(response, status.HTTP_201_CREATED)
        post = SMPost.objects.get()
        self.assert_approvals(post)
        self.assertEqual(post.last_edit_user, self.editor)
        self.assertEqual(post.slug, "campus-story")

    def test_post_records_approvals_for_groups_the_user_belongs_to(self):
        cases = (
            (self.approver, True, True),
            (self.copy_editor, True, False),
            (self.online_editor, False, True),
        )
        for user, copy, online in cases:
            with self.subTest(user=user.username):
                self.authenticate(user)
                existing = SMPost.objects.count()
                response = self.post(pub_ready_copy=copy, pub_ready_online=online)
                self.assert_status(response, status.HTTP_201_CREATED)
                self.assertEqual(SMPost.objects.count(), existing + 1)
                post = SMPost(pk=response.data["id"])
                self.assert_approvals(
                    post,
                    copy_user=user if copy else None,
                    online_user=user if online else None,
                )
                self.assertEqual(post.last_edit_user, user)

    # Update approval permissions

    def test_put_rejects_unauthorized_approval_changes_atomically(self):
        for field in ("pub_ready_copy", "pub_ready_online"):
            for approved in (False, True):
                with self.subTest(field=field, approving=not approved):
                    post = self.create_post(
                        **{
                            field: approved,
                            f"{field}_user": self.approver if approved else None,
                        }
                    )
                    before = self.post_state(post)
                    self.authenticate(self.editor)
                    response = self.put(
                        post, post_twitter="Rejected caption", **{field: not approved}
                    )
                    self.assert_approval_error(response)
                    self.assertEqual(self.post_state(post), before)

    def test_put_allows_authorized_users_to_set_and_clear_approvals(self):
        post = self.create_post()
        self.authenticate(self.approver)

        response = self.put(post, pub_ready_copy=True, pub_ready_online=True)
        self.assert_status(response, status.HTTP_200_OK)
        self.assert_approvals(post, copy_user=self.approver, online_user=self.approver)

        response = self.put(post, pub_ready_copy=False, pub_ready_online=False)
        self.assert_status(response, status.HTTP_200_OK)
        self.assert_approvals(post)

    def test_put_allows_ordinary_edit_with_unchanged_approvals(self):
        post = self.create_post(
            pub_ready_copy=True,
            pub_ready_online=True,
            pub_ready_copy_user=self.copy_editor,
            pub_ready_online_user=self.online_editor,
        )
        self.authenticate(self.editor)
        response = self.put(
            post, slug="updated-story", pub_ready_copy=True, pub_ready_online=True
        )
        self.assert_status(response, status.HTTP_200_OK)
        self.assert_approvals(
            post, copy_user=self.copy_editor, online_user=self.online_editor
        )
        self.assertEqual(post.slug, "updated-story")
        self.assertEqual(post.last_edit_user, self.editor)

    # Validation, authentication, and version conflicts

    def test_put_rejects_invalid_story_url_without_changes(self):
        post = self.create_post()
        before = self.post_state(post)
        self.authenticate(self.editor)

        response = self.put(
            post, story_url="invalid URL", post_twitter="Rejected caption"
        )

        with self.subTest(check="validation status"):
            self.assert_status(response, status.HTTP_400_BAD_REQUEST)
        with self.subTest(check="URL validation error"):
            self.assertIn("story_url", response.data)
            self.assertIsInstance(response.data["story_url"], list)
            self.assertTrue(response.data["story_url"])
        self.assertEqual(self.post_state(post), before)

    def test_post_rejects_invalid_story_url_without_creating_post(self):
        self.authenticate(self.editor)
        response = self.post(story_url="invalid URL")
        self.assert_status(response, status.HTTP_400_BAD_REQUEST)
        self.assertIn("story_url", response.data)
        self.assertFalse(SMPost.objects.exists())

    def test_unauthenticated_post_is_rejected_without_creating_post(self):
        response = self.post()
        self.assert_status(response, status.HTTP_403_FORBIDDEN)
        self.assertFalse(SMPost.objects.exists())

    def test_unauthenticated_put_is_rejected_without_changes(self):
        post = self.create_post()
        before = self.post_state(post)

        response = self.put(post, post_twitter="Rejected caption")

        self.assert_status(response, status.HTTP_403_FORBIDDEN)
        self.assertEqual(self.post_state(post), before)

    def test_put_increments_version_and_rejects_a_stale_edit(self):
        post = self.create_post(version_number=3)
        stale_version = post.version_number
        self.authenticate(self.approver)
        response = self.put(post, post_twitter="First saved edit")
        self.assert_status(response, status.HTTP_200_OK)
        post.refresh_from_db()
        self.assertEqual(post.version_number, stale_version + 1)
        self.assertEqual(response.data["version_number"], post.version_number)
        self.assertEqual(post.post_twitter, "First saved edit")
        before = self.post_state(post)

        self.authenticate(self.editor)
        response = self.put(
            post, version_number=stale_version, post_twitter="Stale edit"
        )

        self.assert_status(response, status.HTTP_400_BAD_REQUEST)
        self.assertTrue(response.data.get("error"))
        self.assertEqual(self.post_state(post), before)
