# meow [![Updates](https://pyup.io/repos/github/daily-bruin/meow/shield.svg)](https://pyup.io/repos/github/daily-bruin/meow/)

_Daily Bruin's Twitter and Facebook poster_

## Table of Contents

- [Technologies Used](#)
- [Services Used](#)
- [Structure](#)
- [Getting Started](#)
- [Adding A Database Field](#)

## Technologies Used

- [Docker](https://www.docker.com/what-docker) is our way of putting the code
  for meow in "containers" so you can run it the same on any machine.

### Frontend

- [React](https://reactjs.org) is a popular JavaScript library for building user
  interfaces.

### Backend

- [Django](https://www.djangoproject.com/) is a Web framework that makes working
  with databases easier!
- [Celery](http://www.celeryproject.org/) is a task scheduler that runs certain
  "tasks" at certain intervals.

## Services Used

- [Pyup](https://pyup.io/) is something you'll become very familiar with, as it
  checks all the dependencies for meow and tells you when it's time to update!

## Structure

```
.
├── Dockerfile
├── LICENSE
├── Procfile
├── Procfile.dev
├── docker-compose.yml
├── entrypoint-dev.sh
├── entrypoint.sh
├── meow
│   ├── manage.py
│   ├── meow
│   ├── scheduler
│   ├── static
│   └── templates
├── production.yml
├── rancher.yml
├── readme.md
└── requirements.txt
```

## Getting Started

### 0. Grab this repo, create an `.env`

Clone the repository, then create a `.env` file at the top level.

```bash
git clone https://github.com/daily-bruin/meow.git
cd meow
echo -e "REDIS_URL=redis://redis:6379/\nDATABASE_URL=postgres://postgres@db:5432/postgres\n" > meow/.env
```

Be sure to also add a `SLACK_ENDPOINT` variable. You can get the value of it
[here](https://dailybruin.slack.com/archives/CA5HGUUV7/p1526607201000113).

### 1. Build images

Next, pull and build the relevant Docker images. Make sure you have Docker
running! (Mac users: there should be a whale icon in your status bar.)

```bash
docker-compose build
```

### 2. Install dependencies

Time to install all the required packages that make meow run on your machine!
Run:

```bash
npm install
```

### 3. Run migrations

We then need run some
[migrations](https://docs.djangoproject.com/en/2.0/topics/migrations/) to set up
the database.

```bash
docker-compose run web meow/manage.py migrate
```

### 4. Initialize some variables

Now let's initialize some of the runtime configuration necessary for meow to
run.

```bash
docker-compose run web meow/manage.py init
```

### 5. Create a superuser

```bash
docker-compose run web meow/manage.py createsuperuser
```

The `Username` should be your name and `Email Address` should be your media
email. Make sure you remember your password for later!

### 6. Start meow

Now we need to start meow! You'll be doing this a lot, so be sure to remember
this command:

```bash
docker-compose up
```

If you ever get an error about `ERROR: Pidfile (celerybeat.pid) already exists.`
or something similar, you need to remove the `celerybeat.pid` file that has been
created. A simple `rm celerybeat.pid` and you're good to go! Speaking of
Celery...

### 7. Compiling the frontend

Since the redesign for meow is done with React, we need a way to compiled all
that code into something that Django can recognize and (more importantly)
serve to our user!

To do this, open up a **separate** Terminal tab by pressing Ctrl+T on Mac and
run the command:

```bash
npm run watch
```

This tells webpack to compile and watch for any changes in the frontend so it
can recompile!

### 8. Check it out!

Point your browser to [`localhost:5000`](http://localhost:5000). Login with that
superuser account you created (you remember your password, right?).

### 9. Use that to configure Celery beat for sending out our social media posts!

Now that meow is up and running, head to
[`localhost:5000/admin/django_celery_beat/periodictask`](http://localhost:5000/admin/django_celery_beat/periodictask).
A bit of terminology first, though! Celery is our Python program to
automatically run certain "tasks" or jobs, like sending out social media posts
in this case. Celery works by calling these "tasks" every interval that you tell
it to. To actually get meow to work on your local machine, you'll need to create
a task so Celery has something to actually do basically.

Once you're on the "Periodic Tasks" page, click that "Add Periodic Task" button
in the top right. Name that task "My Periodic Task". Below that, in the "Task
(registered)" row, make sure `sendposts` is selected.

Below, in the "Schedule" section, we need to create an interval. Hit the plus
button in the "Interval" row and add an interval for every minute. Once you
create that interval, select it from the dropdown.

All other options you can leave alone! Hit that "Save" button when you're done!

### 10. Time to set some variables

Make your way to
[`http://localhost:5000/admin/scheduler/meowsetting/`](http://localhost:5000/admin/scheduler/meowsetting/)
and go to `site_url`. By default, it'll probably be something like
`http://meow.dailybruin.com`, in which case you'll want to change it to
`http://localhost:5000`.

You'll also need to go to the Slack channel `#meow-dev` and look at
[this message](https://dailybruin.slack.com/archives/C7KPPH80K/p1527652524000087)
(it's pinned) and use that to set the following fields:

- `fb_app_secret`
- `fb_app_id`
- `twitter_consumer_secret`
- `twitter_consumer_key`

### 11. Add a Section

The last thing you have to do before you can connect meow to your social media
is create a section at
[`localhost:5000/admin/scheduler/section/`](http://localhost:5000/admin/scheduler/section/)
Click "Add Section" in the top right, and in the "Name" row, add your name in
the field.

### 12. Connect Social Media Accounts

Navigate to [`localhost:5000/manage/`](http://localhost:5000/manage/), and click
on "Twitter/Facebook accounts". Make sure you're an admin for the Facebook page
you want to connect to and click "Connect with Facebook"! Follow the steps on
when you're redirected to Facebook. At the end, you will be prompted to choose a
section and a page. Click on the dropdown for "Choose a section" and click on
the section you created in step 9. Then click on the dropdown for "Choose a
page" and click on the Facebook page you want to connect to. Once you click
"Connect," you can send posts to Facebook with meow!

The next step is to connect your Twitter account to meow. Head back to
[`localhost:5000/manage/`](http://localhost:5000/manage/). Ensure that you're
logged in to the Twitter account you wish to post to or else you might end up
posting to your personal Twitter! Click "Connect with Twitter" and then
"Authorize app." When prompted to "Choose a section," select the one you created
in step 9. After clicking "Connect," you can begin sending meow posts Twitter.

### 13. Send a Post!

At [`localhost:5000`](http://localhost:5000/), you can begin sending meows.
Click "New" in the top right, and fill in the fields. A slug is a relatively
unique string used in the newsroom to identify stories in production (e.g., a
story about cats could be called `news.catattack`).

## Adding A Database Field

In Django, if you want to add fields to your database (postgreSQL in our case),
you would add a line to a class (each of which represents a table) in models.py.
Once you finish adding your attributes, you will need to re-make migrations and
re-build before you use those additional attributes.

```bash
docker-compose run web meow/manage.py makemigrations
docker-compose run web meow/manage.py migrate
docker-compose --build
```

If you want to artificially insert rows into any of your local databases, use
the following command to access the postgreSQL container.

```bash
docker ps
*c2bd3a5f4968*        postgres:latest         "docker-entrypoint..."   2 months ago        Up 3 hours          0.0.0.0:5432->5432/tcp           meow_db_1
```

container ID = bolded above though yours may be different (c2bd3a5f4968)

```bash
docker exec -it <container ID> psql -U postgres
```

Now you add rows to the database using postgreSQL commands.

## Slack oAuth Guide

1. `git fetch`
2. `git checkout dustin/react`
3. `git pull`
4. Go to [this Slack message](https://dailybruin.slack.com/archives/C7KPPH80K/p1541557984004300) and copy the contents into your `.env` file in the root directory. (Overwrite the previous contents)
5. `docker-compose down` (This will clear out any superusers you already have defined)
6. `docker-compose build` (This will take awhile)
7. `docker-compose run web meow/manage.py migrate`
8. `docker-compose run web meow/manage.py createsuperuser` (Values can be anything as long as you remember them.)
9. `docker-compose up`
10. (In new Terminal window (open with `Cmd+T` on Mac)) `npm install`
11. `npm run watch`
12. Go to http://localhost:5000/admin/
13. Login with superuser account you made
14. Go to Social accounts > Social applications
15. Add
16. Provider: Slack; Name can be anything; Client id and secret [here](https://dailybruin.slack.com/archives/C7KPPH80K/p1541558728005100); key is null
17. Click save
18. Go to Sites
19. Add `http://localhost:5000/`
20. Go back to the slack provider you defined and add the site
21. Go to Terminal
22. `docker-compose run web meow/manage.py shell`
23. `from django.contrib.sites.models import Site`
24. `Site.objects.get(id=5)` until you get localhost:5000
25. Change `SITE_ID` to 5 in `meow/settings.py`

## Linting FAQ

We use a combination of [eslint](https://eslint.org/docs/about/) and
[prettier](https://prettier.io/) for our linting and code formatting.

With a few exceptions, we follow the [Airbnb JavaScript guide](https://github.com/airbnb/javascript).

### `Useless constructor`

If the constructor for any class does not do anything except call
`super(props)`, then this is deemed a "useless constructor" because it does not
do anything meaningful for that class.

If you bind a function or set the state to a default value, then this error
will disappear.

### `Component should be written as a pure function`

If you have a component that does not keep its own state (i.e. does not have
any variables or values in its state), then you can more accurately and
succinctly write the component as a function! See
[here](https://stackoverflow.com/a/40853268) for an example!

### `Unexpected block statement surrounding arrow body; move the returned value immediately after the =>.`

If you have a function defined like this:

```javascript
const myComponent = () => {
  return (
    <div>
      <p />
    </div>
  );
};

export default myComponent;
```

Then change it to this:

```javascript
const myComponent = () => (
  <div>
    <p />
  </div>
);
```

## License

Meow is released under GNU AGPLv3. See [`LICENSE`](/LICENSE) for more details.

Though not required, if you use this software or would like to contribute to its
development, please let us know by emailing us at
[online@media.ucla.edu](mailto:online@media.ucla.edu). We'd love to know what
it's being used for, especially if it's at another college newspaper.
