"""Redact OAuth credentials from application and development request logs."""

import re

from django.utils.log import ServerFormatter


class OAuthRedactingFormatter(ServerFormatter):
    # Covers callback query strings, OAuth header fields and named JSON values.
    credential = re.compile(
        r"(\b(?:oauth_token(?:_secret)?|oauth_verifier|oauth_consumer_key|"
        r"access_token(?:_secret)?|consumer_key|consumer_secret|"
        r"twitter_access_key|twitter_access_secret)\b[\"']?\s*[:=]\s*[\"']?)"
        r"[^&\s\"',<>]+",
        re.IGNORECASE,
    )

    def format(self, record):
        # Redact after formatting so interpolated arguments and tracebacks are
        # covered too, without altering the request or exception itself.
        return self.credential.sub(r"\1[REDACTED]", super().format(record))
