# Meow [![Updates](https://pyup.io/repos/github/daily-bruin/meow/shield.svg)](https://pyup.io/repos/github/daily-bruin/meow/)

_Daily Bruin's Twitter and Facebook poster_

## Technologies Used

* yapf

### Frontend

* React

### Backend

* Django
* Celery

## Services Used

* Pyup

## Structure

## Development

### 0. Grab this repo, create an `.env`

Clone the repository, then create a `.env` file at the top level.

```bash
git clone https://github.com/daily-bruin/meow.git
cd meow
echo -e REDIS_URL=redis://redis:6379/\nDATABASE_URL=postgres://postgres@db:5432/postgres > meow/.env
```

### 1. Build images

Next, pull and build the relevant Docker images.

```bash
docker-compose build
```

### 2. Run migrations

We then need run some migrations to set up the database.

```bash
docker-compose run web meow/manage.py migrate
```

### 3. Initialize some variables

Now let's initialize some of the runtime configuration necessary for meow to
run.

```bash
docker-compose run web meow/manage.py init
```

When prompted for input, you can leave the fields blank for now.

You can create your own Twitter/Facebook apps for this, or ask one of the
PMs/editors for the keys to some test accounts.

### 4. Create a superuser

```
docker-compose run web meow/manage.py createsuperuser
```

### 5. Use that to configure Celery beat for sending out our social media posts!

Navigate to
[`0.0.0.0:5000/admin/django_celery_beat/periodictask/`](0.0.0.0:5000/admin/django_celery_beat/periodictask/).
Login with your created superuser and create a periodic task to send out the
posts!

## Testing migrations in meow

Run migrations in the docker environment with `docker-compose run web sh`.

---

## Test accounts

These are only used for testing and are set as private. When testing is over,
these accounts should be deleted and removed from this page.

### General

#### Connect dev environment to Daily Bruin social media accounts

Click the wiki tab on the repository and navigate to the "meow setup" page.

#### Twitter

**DailyBruinTest** `bruin111` online+fakedb@media.ucla.edu

#### Facebook

**FakeDBthatCalvinCreated** Page ID: `160988910774531`

#### Facebook

**FakeDB** Page ID: `1416676115217881`

### A&E

#### Facebook

**FakeDB A&E** Page ID: `1415944791959246`

---

## License

Meow is released under GNU AGPLv3. See `LICENSE` for more details.

Though not required, if you use this software or would like to contribute to its
development, please let us know by emailing us at online@media.ucla.edu. We'd
love to know what it's being used for, especially if it's at another college
newspaper.
