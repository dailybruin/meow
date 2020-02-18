# meow [![Updates](https://pyup.io/repos/github/daily-bruin/meow/shield.svg)](https://pyup.io/repos/github/daily-bruin/meow/)

_Daily Bruin's Twitter and Facebook post scheduler_

## Technologies Used

- [Docker](https://www.docker.com/what-docker) is our way of putting the code
  for meow in "containers" so you can run it the same on any machine.

### Frontend

- [React](https://reactjs.org) is a popular JavaScript library for building user
  interfaces.
- [Redux](https://redux.js.org/) is a library for maintaining a global state across the
  entire frontend.

### Backend

- [Django](https://www.djangoproject.com/) is a Web framework that makes working
  with databases easier!
- [Celery](http://www.celeryproject.org/) is a task scheduler that runs certain
  "tasks" at certain intervals.

## Structure

```
.
├── Dockerfile
├── LICENSE
├── Procfile
├── Procfile.dev
├── docker-compose.yml
├── entrypoint.sh
├── meow
│   ├── manage.py
│   ├── frontend
│       └── src
│   ├── meow
│       └── settings.py
│   ├── scheduler
│   ├── ... all other django apps
│   ├── static
│   └── templates
├── readme.md
└── requirements.txt
```

## Getting Started

### 0. Grab this repo

Clone the repository.

```bash
git clone https://github.com/daily-bruin/meow.git
cd meow
```

### 1. Shortcut: init-script

To make this whole process easier, we have a script which will run all the steps except `npm run watch`. Note: the script may pause at certain points to prompt you for secrets or **environment variables**. If you are part of Daily Bruin, ask the Internal Tools Editor for these values since we have accounts for those set up already.

```bash
./init_script.sh
```

If you get an error saying cannot connect to docker daemon, you may need to run docker commands with `sudo`. Try calling the sudo version of the init_script.

```bash
./sudo_init_script.sh # Only run if the ./init_script.sh did not work.
```

Once you run this, just run `docker-compose up` in one terminal tab and `npm run watch` in another. Then go to
`localhost:5000` and you should see 1 of several random cats pics :D (and the login page). Now you are done and you can skip all the other steps.

### 2. Compiling the frontend

Since the redesign for meow is done with React, we need a way to compiled all
that code into something that Django can recognize and (more importantly)
serve to our user!

First, [increase max inotify watchers](https://github.com/guard/listen/wiki/Increasing-the-amount-of-inotify-watchers).

Then, open up a **separate** Terminal
run the command:

```bash
npm run watch
```

`npm run watch` will recompile the code everytime you make a change! If you don't like this, you can also
run `npm run build` every time you change your code.

### 3. Check it out!

Point your browser to [`localhost:5000`](http://localhost:5000). Login with your Daily Bruin slack.

### 4. Connect Social Media Accounts

Navigate to [`localhost:5000/manage/`](http://localhost:5000/manage/), and click
on "Twitter/Facebook accounts". Make sure you're an admin for the Facebook page
you want to connect to and click "Connect with Facebook"! Follow the steps on
when you're redirected to Facebook. At the end, you will be prompted to choose a
section and a page. Click on the dropdown for "Choose a section" and click on
the section `Test`. Then click on the dropdown for "Choose a
page" and click on the Facebook page you want to connect to. Once you click
"Connect," you can send posts to Facebook with meow!

The next step is to connect your Twitter account to meow. Head back to
[`localhost:5000/manage/`](http://localhost:5000/manage/). Ensure that you're
logged in to the Twitter account you wish to post to or else you might end up
posting to your personal Twitter! Click "Connect with Twitter" and then
"Authorize app." When prompted to "Choose a section," select `Test`.
After clicking "Connect," you can begin sending meow posts Twitter.

### 5. Send a Post!

At [`localhost:5000`](http://localhost:5000/), you can begin sending meows.
Click "New" in the top right, and fill in the fields. A slug is a relatively
unique string used in the newsroom to identify stories in production (e.g., a
story about cats could be called `news.breaking.meowisdown`).

### 6. Create a Superuser

Superusers have access to Django's admin side. The admin side allows you to access most of the
database through a nice UI.

```
docker-compose run web meow/manage.py createsuperuser
```

You can use any email and password. For example, you can set username=`admin`, email=`a@a.com`, and password=`admin123`.

Then navigate to [`localhost:5000/admin/`](localhost:5000/admin/). **THE TRAILING SLASH IS REQUIRED**. Login with the username
and password from the previous step and now you can access the _admin side_.

## Adding A Database Field

In Django, if you want to add fields to your database,
you would add a field to the corresponding model (each of which represents a table) in `models.py`.
Once you finish adding your attributes, you will need to run `makemigrations` so django
will create code to update the underlying database table headers appropriately.

```bash
docker-compose run web meow/manage.py makemigrations # django makes a script to update database headers
docker-compose run web meow/manage.py migrate        # django runs all those scripts it made
docker-compose up --build
```

## Django Shell

The `manage.py shell` allows you to run any python code in an interactive shell!

In order to access this shell, run `docker-compose run web ./meow/manage.py shell`. Then a prompt like this should show:

```
Python 3.6.9 (default, Nov 15 2019, 03:26:27)
[GCC 8.3.0] on linux
Type "help", "copyright", "credits" or "license" for more information.
(InteractiveConsole)
>>>
```

### Useful Examples

1. Create SMPost (or an instance of any model)

```
>>> from scheduler.models import *
>>> p =SMPost.objects.create(slug="test")
>>> print(p)
test
>>>
```

2. Get all SMPosts (or an instance of any model)

```
>>> from scheduler.models import *
>>> posts =SMPost.objects.all()
>>> print(posts)
<QuerySet [<SMPost: test>, <SMPost: test>, <SMPost: a>, <SMPost: b>, <SMPost: test>]>
```

3. Find and delete a particular SMPosts (or an instance of any model)

```
>>> from scheduler.models import *
>>> post = SMPost.objects.get(id=number_in_the_url_in_the_edit_meow_page)
>>> post.delete()
```

## Linting

We use a combination of [eslint](https://eslint.org/docs/about/) and
[prettier](https://prettier.io/) for our linting and code formatting.

With a few exceptions, we follow the [Airbnb JavaScript guide](https://github.com/airbnb/javascript).

## License

Meow is released under GNU AGPLv3. See [`LICENSE`](/LICENSE) for more details.

Though not required, if you use this software or would like to contribute to its
development, please let us know by emailing us at
[online@media.ucla.edu](mailto:online@media.ucla.edu). We'd love to know what
it's being used for, especially if it's at another college newspaper.
