# Django settings for meow project.
import os
import environ

root = environ.Path(__file__) - 3  # three folder back (/a/b/c/ - 3 = /)
env = environ.Env(DEBUG=(bool, False),)  # set default values and casting
environ.Env.read_env()  # reading .env file

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))

SECRET_KEY = env('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')

if not DEBUG:
    ALLOWED_HOSTS = [env('SITE_HOST'), ]
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']

DATABASES = {
    'default': env.db()
}

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
ALLOWED_HOSTS = ["0.0.0.0", "localhost"]
if os.environ.get('HOSTS'):
    ALLOWED_HOSTS.append(os.environ.get('HOSTS'))

# Local time zone for this installation. Choices can be found here:
# http://en.wikipedia.org/wiki/List_of_tz_zones_by_name
# although not all choices may be available on all operating systems.
# In a Windows environment this must be set to your system time zone.
TIME_ZONE = 'America/Los_Angeles'

# Language code for this installation. All choices can be found here:
# http://www.i18nguy.com/unicode/language-identifiers.html
LANGUAGE_CODE = 'en-us'

# If you set this to False, Django will make some optimizations so as not
# to load the internationalization machinery.
USE_I18N = True

# If you set this to False, Django will not format dates, numbers and
# calendars according to the current locale.
USE_L10N = True

# If you set this to False, Django will not use timezone-aware datetimes.
USE_TZ = True

# Absolute filesystem path to the directory that will hold user-uploaded files.
# Example: "/var/www/example.com/media/"
MEDIA_ROOT = ''

# URL that handles the media served from MEDIA_ROOT. Make sure to use a
# trailing slash.
# Examples: "http://example.com/media/", "http://media.example.com/"
MEDIA_URL = ''

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/var/www/example.com/static/"
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'frontend'),
)

# URL prefix for static files.
# Example: "http://example.com/static/", "http://static.example.com/"
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# List of finder classes that know how to find static files in
# various locations.
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    #    'django.contrib.staticfiles.finders.DefaultStorageFinder',
)

# Make this unique, and don't share it with anybody.
if os.environ.get('SECRET_KEY'):
    SECRET_KEY = os.environ.get('SECRET_KEY')
else:
    SECRET_KEY = 'i%w$mm*w7mgw)q1hly1+c8z14en3$v#)3sf)u#xripu@rxjyw7'

MIDDLEWARE = (
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # Uncomment the next line for simple clickjacking protection:
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'social_django.middleware.SocialAuthExceptionMiddleware'
)

ROOT_URLCONF = 'meow.urls'

# Python dotted path to the WSGI application used by Django's runserver.
WSGI_APPLICATION = 'meow.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, "templates")
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',

                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ],
        },
    },
]

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Uncomment the next line to enable the admin:
    'django.contrib.admin',
    # Uncomment the next line to enable admin documentation:
    'django.contrib.admindocs',
    'webpack_loader',
    # 'django_slack_oauth',
    'social_django',

    # 'allauth',
    # 'allauth.account',
    # 'allauth.socialaccount',
    # 'allauth.socialaccount.providers.google',

    'scheduler',
    'user_profile',
    'django_celery_beat',

    'rest_framework',
    'rest_framework.authtoken',

    # 'rest_auth',
    # 'rest_auth.registration',

    # 'oauth2_provider',
)

# A sample logging configuration. The only tangible logging
# performed by this configuration is to send an email to
# the site admins on every HTTP 500 error when DEBUG=False.
# See http://docs.djangoproject.com/en/dev/topics/logging for
# more details on how to customize your logging configuration.
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
    }
}

AUTH_USER_MODEL = 'user_profile.User'

REST_AUTH_SERIALIZERS = {
    'USER_DETAILS_SERIALIZER': 'user_profile.serializers.UserSerializer',
}

AUTHENTICATION_BACKENDS = [
    'social_core.backends.slack.SlackOAuth2',
    'django.contrib.auth.backends.ModelBackend',
]

REST_SESSION_LOGIN = False

ACCOUNT_EMAIL_VERIFICATION = 'none'

ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
SITE_ID = 1

# SOCIALACCOUNT_PROVIDERS = {
#     'google': {
#         'SCOPE': [
#             'profile',
#             'email',
#             'https://www.googleapis.com/auth/drive',
#             'https://www.googleapis.com/auth/drive.file'
#         ],
#         'AUTH_PARAMS': {
#             'access_type': 'offline',
#             'hd': 'media.ucla.edu',
#             'approval_prompt': 'force'
#         }
#     }
# }

# Webpack
WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': not DEBUG,
        'BUNDLE_DIR_NAME': 'bundles/',
        'STATS_FILE': os.path.join(os.path.dirname(BASE_DIR), 'webpack-stats.json'),
    }
}

LOGIN_URL = '/login/'
LOGIN_REDIRECT_URL = '/'

if os.environ.get('REDIS_URL') is not None:
    CELERY_BROKER_URL = os.environ.get('REDIS_URL')
else:
    CELERY_BROKER_URL = 'redis://'

SLACK_ENDPOINT = os.environ.get('SLACK_ENDPOINT')

SOCIAL_AUTH_SLACK_KEY = os.environ.get('SLACK_CLIENT_ID')
SOCIAL_AUTH_SLACK_SECRET = os.environ.get('SLACK_CLIENT_SECRET')
SOCIAL_AUTH_IGNORE_DEFAULT_SCOPE = True
SOCIAL_AUTH_SLACK_SCOPE = [
    'channels:read, groups:history, groups:read, users:read, users:read.email']

SOCIAL_AUTH_SLACK_TEAM = 'dailybruin'

SOCIAL_AUTH_USER_MODEL = 'user_profile.User'

# SOCIAL_AUTH_PIPELINE = (
#     'social_core.pipeline.social_auth.social_details',
#     'social_core.pipeline.social_auth.social_uid',
#     'social_core.pipeline.social_auth.auth_allowed',
#     'social_core.pipeline.social_auth.social_user',
#     'user_profile.pipelines.slackid_as_username',
#     'social_core.pipeline.user.get_username',
#     'social_core.pipeline.user.create_user',
#     'social_core.pipeline.social_auth.associate_user',
#     'social_core.pipeline.social_auth.load_extra_data',
#     'social_core.pipeline.user.user_details',
# )
