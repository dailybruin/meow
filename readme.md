# Meow
*Daily Bruin's Twitter and Facebook poster*

## [NEW] Dev environment using Docker Compose
We've switched over to a Procfile (Heroku/Flynn/Dokku) based system for configuring and deploying our system! In most scenarios, a `git push <server-remote> master` will be sufficient to deploy the service. We've also paired this with a newer, leaner and hopefully easier way to develop meow using a Docker Compose based workflow. Should our compute needs and resources grow in the future, we could also switch to a complete Docker deploy pipeline.

### 0. Grab this repo, create an `.env`
`git clone https://github.com/daily-bruin/meow.git` - clones the repo
`cd meow` - enter the directory
`echo "REDIS_URL=redis://redis:6379/\nDATABASE_URL=postgres://postgres@db:5432/postgres" > .env` - bare minimum ENV variables

### 1. Build images
`docker-compose build` - builds and pulls the relevant Docker images

### 2. Run migrations
`docker-compose run web migrate` - run the migrations 

### 3. Initialize some variables
`docker-compose run web meow/manage.py init` - initialize some of the runtime config necessary for meow to run

Most of these can be left blank for now.
You can create your own Twitter/Facebook apps for this, or ask one of the PMs/editors for the keys to some test accounts.

### 4. Create a superuser
`docker-compose run web meow/manage.py createsuperuser`

### 5. Use that to configure Celery beat for sending out our social media posts!
Navigate to `0.0.0.0:5000/admin/django_celery_beat/periodictask/`. Login with your created superuser and create a periodic task
to send out the posts!

## [DEPRECATED] Installation instructions

### 1. Install system packages
These instructions are meant for Ubuntu. If you are using something other than ubuntu, find the packages on your own.
#### With Vagrant
If you want to use [Vagrant](http://www.vagrantup.com/), clone this repo and `vagrant up` will automatically install everything in this section.
#### Without Vagrant
Install the required packages:

    sudo apt-get update
    sudo apt-get install python-pip python-setuptools python-dev fabric git postgresql postgresql-server-dev-9.1 sendmail

### 2. Create a virtual environment (optional)
I prefer virtualenvwrapper since virtualenv depends on symlinks and VirtualBox shared folders don't support symlinks.

Install it like this:

    sudo easy_install virtualenv
    sudo pip install virtualenvwrapper

And add this line to your `.bashrc`:

    source /usr/local/bin/virtualenvwrapper.sh

Make a virtualenv:

    mkvirtualenv meow

And activate the vitualenv (it does this automatically after creating it):

    workon meow

To deactiveate...

    deactivate

### 3. Install python packages
Install psycopg2 (a postgres adapter) outside of your virtualenv

    easy_install psycopg2

Then within your virtualenv install everything in `requirements.txt` within this repo

    pip install -r requirements.txt


### 4. Configure django
Configure your database in django. For development environments, open `/etc/postgresql/9.1/main/pg_hba.conf` in a text editor (you may need to install something like `vim`) and, around line 84, change the word `peer` or `md5` to `trust` like so:

```
# Database administrative login by Unix domain socket
local   all             postgres                                trust

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     trust
```
reload the database:

    /etc/init.d/postgresql reload

Create a database (this makes a database with the name "meow"):

    createdb -U postgres meow

Then in `meow/meow/settings.py` configure your database settings. If you followed these instructions, this should work:

```
'ENGINE': 'django.db.backends.postgresql_psycopg2',
'NAME': 'meow',
'USER': 'postgres',
'PASSWORD': '',
```

Sync the databases through django and create your own superuser:

    python manage.py syncdb
    python manage.py migrate


### 5. Configure meow
Run `python manage.py init` to configure all settings.

For this part of the set up you will need

twitter consumer key and consumer secret: https://apps.twitter.com/app/new

additionally for twitter, you will need to fill in the Callback URL

facebook app ID and app secret: https://developers.facebook.com/docs/apps/register

bitly access token: https://bitly.com/a/oauth_apps

### 6. Configure sections
Use the default Django admin (http://[YOUR_URL]/admin) to add a Section object. To find Twitter access keys/tokens, use the instructions at

    python manage.py twitter_auth

and to find the Facebook tokens, [use these instructions](http://stackoverflow.com/questions/17620266/getting-a-manage-page-access-token-to-upload-events-to-a-facebook-page).


## Running meow
Run meow by going into the `meow` directory of the repo and typing

    fab rs

This will run meow on 0.0.0.0:8000 (not the default 127.0.0.1:8000) so it can be accessible from other machines. (i.e. accessing meow from a host when meow is running on a VM).

If you want to run it on a different port, the fabric command takes an argument. For instance,

    fab rs:2000

will listen on port 2000.

## Sending tweets
Tweets are sent through a management command. In `meow/`, execute:

    python manage.py sendposts

This will send any posts that are marked as copy-edited and ready for publication but are not yet sent. If you want posts to send automatically, put this on a cron job.

The Daily Bruin's cron job is something like:

```
#! /bin/bash
source meow-venv/bin/activate
python meow/manage.py sendposts
```

`sendposts` will output the facebook post or tweet when it tries to send to `stdout` (in ASCII) so feel free to implement logging. Almost all sending errors, however, are saved within meow's database for easy access.

***

## Test accounts
These are only used for testing and are set as private. When testing is over, these accounts should be deleted and removed from this page.

### General
#### Twitter
**DailyBruinTest**    
`bruin111`    
online+fakedb@media.ucla.edu

#### Facebook
**FakeDBthatCalvinCreated**    
Page ID: `160988910774531`

#### Facebook
**FakeDB**    
Page ID: `1416676115217881`

### A&E
#### Facebook
**FakeDB A&E**    
Page ID: `1415944791959246`

***

## License
Meow is released under GNU AGPLv3. See `LICENSE` for more details.

Though not required, if you use this software or would like to contribute to its development, please let us know by emailing us at online@media.ucla.edu. We'd love to know what it's being used for, especially if it's at another college newspaper.
