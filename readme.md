# Meow
*Daily Bruin's Twitter and Facebook poster*

## Getting Started

### Without Vagrant, With Virtualenv

Make sure your system meets the requirements. If not, install the dependencies listed in the vagrantinit file.

```
sudo apt-get -y install ntp
sudo apt-get -y install vim
sudo apt-get -y install python-pip
sudo apt-get -y install python-setuptools
sudo apt-get -y install python-dev
sudo apt-get -y install fabric
sudo apt-get -y install git
sudo apt-get -y install postgresql
sudo apt-get -y install postgresql-server-dev-9.1
sudo apt-get -y install screen
sudo easy_install virtualenv
```

Install psycopg2

`easy_install psycopg2`

Create a virtualenv `virtualenv meow` in a directory of your choosing. 
Within the virtualenv, install all the python libraries listed in requirements.txt.

`pip install -r requirements.txt`

Sync the databases through django

`python manage.py syncdb`
`python manage.py migrate`

Configure django to connect to your database. Within meow/settings.py, you may have to change the host, user, or password fields of the connection. 

If you are running meow on a local development VM, you may have to specify localhost for the host. In addition, you may have to configure postgres to accept connections from meow. For developmental purposes, you may edit pg_hba.conf to trust all connections from localhost/127.0.0.1. DO NOT DO THIS IN PRODUCTION.

## Settings
Right now, meow requires the following settings defined in the settings model:

```
 id |       setting_key       |                       setting_value
----+-------------------------+-----------------------------------------------------------
  1 | twitter_consumer_key    | OtVavzvwyUfOlETpDOg
  2 | twitter_consumer_secret | 0wUHlrQSvB8GMHWDoCdFNjwrmDddug9AjUBjh2qE
  3 | fb_default_photo        | http://dailybruin.com/images/2013/01/dailybruinicon2.jpeg
  4 | twitter_character_limit | 117
```

Please note that these are sample values.

## Test accounts
These are only used for testing and are set as private. When testing is over, these accounts should be deleted and removed from this page.

### General
#### Twitter
**FakeDB1**    
`db1111`    
online+fakedb@media.ucla.edu

#### Facebook
**FakeDB**    
Page ID: `1416676115217881`

### Opinion
#### Twitter
**FakeDBOP**    
`db1111`    
online+fakedbop@media.ucla.edu

### A&E
#### Twitter
**FakeDBAE**    
`db1111`    
online+fakedbae@media.ucla.edu

#### Facebook
**FakeDB A&E**    
Page ID: `1415944791959246`

### Sports
Sports does not currently have any of its own accounts.
