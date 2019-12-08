# Django settings for meow project.
import os
import environ

root = environ.Path(__file__) - 3  # three folder back (/a/b/c/ - 3 = /)
env = environ.Env(DEBUG=(bool, False),)  # set default values and casting
environ.Env.read_env()  # reading .env file

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env('DEBUG')
SLACK_ENDPOINT = env('SLACK_ENDPOINT')

if not DEBUG:
    ALLOWED_HOSTS = [env('SITE_HOST'), ]
else:
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '[::1]']

# ALLOWED_HOSTS=['*']
# print(ALLOWED_HOSTS)
DATABASES = {
    'default': env.db()
}

# Hosts/domain names that are valid for this site; required if DEBUG is False
# See https://docs.djangoproject.com/en/1.5/ref/settings/#allowed-hosts
# ALLOWED_HOSTS = ["0.0.0.0", "localhost"]
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
    os.path.join(os.path.dirname(BASE_DIR), 'meow', 'frontend', 'bundles'),
    os.path.join(os.path.dirname(BASE_DIR), 'meow', 'frontend', 'img'),
    os.path.join(os.path.dirname(BASE_DIR), 'meow', 'frontend', 'src', 'assets'),
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
            ],
        },
    },
]

INSTALLED_APPS = (
    # Django dep
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',

    # External dep
    'webpack_loader',
    'social_django',
    'corsheaders',
    'django_celery_beat',
    "taggit",

    # Internal dep
    'urls',
    'user_profile',
    'scheduler',
)

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware'
]

CORS_ORIGIN_ALLOW_ALL = False
CORS_ALLOW_CREDENTIALS = True
# CORS_ORIGIN_WHITELIST = (
#     'http://localhost:3000'
# )

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
			'()': 'django.utils.log.RequireDebugFalse',
		},
		'require_debug_true': {
			'()': 'django.utils.log.RequireDebugTrue',
		},
	},
	'formatters': {
		'simple_server': {
			'()': 'django.utils.log.ServerFormatter',
			'format': '[%(asctime)s|%(levelname)s] %(message)s',
		},

	},
	'handlers': {
		'console': {
			'level': 'INFO',
			'filters': ['require_debug_true'],
			'class': 'logging.StreamHandler',
		},
        'logfile': {
            'level':'DEBUG',
            'class':'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'meow.log'),
            'maxBytes': 1024*1024*3, # 3MB
            'backupCount': 3,
            'formatter': 'simple_server'
        },
        # this handler makes errors show up in rancher's console
		'console_debug_false': {
			'level': 'ERROR',
			'filters': ['require_debug_false'],
			'class': 'logging.StreamHandler'
		},
		# 'django.server': {
		# 	'level': 'INFO',
		# 	'class': 'logging.StreamHandler',
		# 	'formatter': 'django.server',
		# },
		# 'mail_admins': {
		# 	'level': 'ERROR',
		# 	'filters': ['require_debug_false'],
		# 	'class': 'django.utils.log.AdminEmailHandler'
		# }
	},
	'loggers': {
		'django': {
			'handlers': ['console', 'console_debug_false', 'logfile'],
			'level': 'INFO',
		},
        'scheduler': {
            'handlers': ['console', 'console_debug_false', 'logfile'],
			'level': 'INFO',
        },
        'oauth': {
            'handlers': ['console', 'console_debug_false', 'logfile'],
			'level': 'INFO',
        },
        # this logger logs 4XX and 5XX responses
		# 'django.server': {
		# 	'handlers': ['django.server'],
		# 	'level': 'INFO',
		# 	'propagate': False,
		# }
	}
}

AUTH_USER_MODEL = 'user_profile.User'

# Webpack
WEBPACK_LOADER = {
    'DEFAULT': {
        'CACHE': False,
        'BUNDLE_DIR_NAME': '/',
        'STATS_FILE': os.path.join(os.path.dirname(BASE_DIR), 'webpack-stats.json'),
    }
}


if os.environ.get('REDIS_URL') is not None:
    CELERY_BROKER_URL = os.environ.get('REDIS_URL')
else:
    CELERY_BROKER_URL = 'redis://'

# Authentication settings for python social auth
AUTHENTICATION_BACKENDS = (
    # SLACK SOCIAL AUTH
    'meow.backend.MeowAuth',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_USER_MODEL = 'user_profile.User'
SOCIAL_AUTH_POSTGRES_JSONFIELD = True

SESSION_COOKIE_AGE=31540000 # cookies expire in a year... keeps user signed in for a year ~ an academic year.

# GOOGLE SOCIAL AUTH
# SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = env('GOOGLE_CLIENT_ID')
# SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = env('GOOGLE_CLIENT_SECRET')
# SOCIAL_AUTH_GOOGLE_OAUTH2_SCOPE = ["email"]
# SOCIAL_AUTH_GOOGLE_OAUTH2_AUTH_EXTRA_ARGUMENTS = {
#     'access_type': 'offline', 'hd': 'media.ucla.edu'}
# SOCIAL_AUTH_GOOGLE_OAUTH2_WHITELISTED_DOMAINS = ['media.ucla.edu', ]

# SLACK SOCIAL AUTH
SOCIAL_AUTH_MEOW_KEY = env('SLACK_CLIENT_ID')
SOCIAL_AUTH_MEOW_SECRET = env('SLACK_CLIENT_SECRET')

# If you change this Slack will throw an error because by default Python Social
# Auth requests the identity scope rather than the users scope and you cannot
# mix identity and user scopes
SOCIAL_AUTH_MEOW_IGNORE_DEFAULT_SCOPE = True
SOCIAL_AUTH_MEOW_SCOPE = ['groups:read',
                          'channels:read', 'users:read', 'users.profile:read']
SOCIAL_AUTH_MEOW_TEAM = 'dailybruin'


SOCIAL_AUTH_LOGIN_REDIRECT_URL = 'http://localhost:5000/' if DEBUG else 'https://meow.dailybruin.com/'
LOGIN_REDIRECT_URL = 'http://localhost:5000/' if DEBUG else 'https://meow.dailybruin.com/'
LOGOUT_REDIRECT_URL = 'http://localhost:5000/' if DEBUG else 'https://meow.dailybruin.com/'

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'social_core.pipeline.user.create_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'meow.pipeline.set_roles_and_profile_pic',
    'social_core.pipeline.user.user_details',
)
