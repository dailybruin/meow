from . import models


def save_profile(backend, user, response, *args, **kwargs):
    if backend.name == 'slack':
        profile = user.get_profile()
        if profile is None:
            profile = Profile(user_id=user.id)
        profile.gender = response.get('gender')
        profile.link = response.get('link')
        profile.timezone = response.get('timezone')
        profile.save()
