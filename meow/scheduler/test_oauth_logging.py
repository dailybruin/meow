import logging
from io import StringIO
from unittest.mock import patch

from django.test import SimpleTestCase

from meow.logging import OAuthRedactingFormatter


class OAuthLoggingTest(SimpleTestCase):
    def test_configured_request_handlers_redact_callback_credentials(self):
        for name in ("django.server", "django.request", "scheduler"):
            with self.subTest(logger=name):
                logger = logging.getLogger(name)
                self.assertTrue(logger.handlers)
                for handler in logger.handlers:
                    # Exercise every configured console/file formatter without
                    # writing test credentials to the real destinations.
                    stream = StringIO()
                    capture = logging.StreamHandler(stream)
                    capture.setFormatter(handler.formatter)
                    record = logging.LogRecord(
                        name, logging.ERROR, __file__, 1,
                        '"GET %s HTTP/1.1" %s',
                        (
                            "/manage/twitter-connect/?oauth_token=private-token"
                            "&oauth_verifier=private-verifier&next=/settings",
                            200,
                        ),
                        None,
                    )
                    capture.handle(record)
                    output = stream.getvalue()
                    self.assertNotIn("private-token", output)
                    self.assertNotIn("private-verifier", output)
                    self.assertIn("[REDACTED]", output)
                    self.assertIn("next=/settings", output)
                    self.assertIn('HTTP/1.1" 200', output)

    def test_named_credentials_redacted_in_exception_traceback(self):
        stream = StringIO()
        handler = logging.StreamHandler(stream)
        handler.setFormatter(OAuthRedactingFormatter("%(message)s"))
        logger = logging.getLogger("test.oauth.redaction")
        with patch.object(logger, "handlers", [handler]), patch.object(
            logger, "propagate", False
        ), patch.object(logger, "level", logging.ERROR):
            try:
                raise RuntimeError("access_token=private-access-token")
            except RuntimeError:
                logger.exception("Connection failed")
        output = stream.getvalue()
        self.assertIn("Traceback", output)
        self.assertIn("RuntimeError", output)
        self.assertNotIn("private-access-token", output)

    def test_named_secret_formats_and_ordinary_logs(self):
        formatter = OAuthRedactingFormatter("%(message)s")
        for message in (
            'oauth_token="private-value"',
            "{'consumer_secret': 'private-value'}",
            "oauth_consumer_key=private-value",
            "access_token_secret=private-value",
            "twitter_access_key=private-value",
        ):
            with self.subTest(message=message):
                record = logging.makeLogRecord({"msg": message})
                self.assertNotIn("private-value", formatter.format(record))
        record = logging.makeLogRecord({"msg": "Connection failed: 403 Forbidden"})
        self.assertEqual(formatter.format(record), "Connection failed: 403 Forbidden")
