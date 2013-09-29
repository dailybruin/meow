# Meow
*Daily Bruin's Twitter and Facebook poster*

## Installation instructions

### 1. Install system packages
These instructions are meant for Ubuntu. If you are using something other than ubuntu, find the packages on your own.
#### With Vagrant
If you want to use [Vagrant](http://www.vagrantup.com/), clone this repo and `vagrant up` will automatically install everything in this section.
#### Without Vagrant
Install the required packages:

    sudo apt-get update
    sudo apt-get install python-pip python-setuptools python-dev fabric git postgresql postgresql-server-dev-9.1

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
Right now, meow requires the following settings defined in the settings model. You can input these in the django admin in the "Meow settings" model.
These are sample values.

```
       setting_key       |                       setting_value
-------------------------+-----------------------------------------------------------
 twitter_consumer_key    | OtVavzvwyUfOlETpDOg
 twitter_consumer_secret | 0wUHlrQSvB8GMHWDoCdFNjwrmDddug9AjUBjh2qE
 fb_default_photo        | http://dailybruin.com/images/2013/01/dailybruinicon2.jpeg
 twitter_character_limit | 117
 bitly_access_token      | ff2g4d50bf7093928d8a5cff9d04gh8a12c1e824
```


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
