from social_core.backends.slack import SlackOAuth2


class CustomSlackAuth(SlackOAuth2):
    STATE_PARAMETER = False
    REDIRECT_STATE = False
