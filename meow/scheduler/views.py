from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.http import HttpResponse, Http404, JsonResponse
from django.shortcuts import redirect, render, get_object_or_404
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from functools import wraps

from scheduler.models import *
from scheduler.serializers import SMPostSerializer, SectionSerializer, PostHistorySerializer

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view

import datetime
import parsedatetime.parsedatetime as pdt
from itertools import chain
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.core.mail import send_mail
from django.contrib.auth.models import User, Group
import tweepy
import facepy
import re
import sys

from meow.celery import sendposts
from .analytics import get_analytics

# Oauth stuff
from requests_oauthlib import OAuth2Session
from requests_oauthlib.compliance_fixes import facebook_compliance_fix



class SectionList(APIView):
    """
    List all SMPosts, or create a new SMPost.
    """

    def get(self, request, format=None):
        if not request.user.is_authenticated:
            return Response("Must be logged in", status=403)
        sections = Section.objects.all()
        serializer = SectionSerializer(sections, many=True)
        return Response(serializer.data)


class SMPostList(APIView):
    """
    List all SMPosts, or create a new SMPost.
    """

    def get(self, request, format=None):
        if not request.user.is_authenticated:
            return Response("Must be logged in", status=403)

        year = request.GET.get('year', None)
        month = request.GET.get('month', None)
        day = request.GET.get('day', None)

        if year and month and day:
            posts = SMPost.objects.filter(
                pub_date=datetime.date(int(year), int(month), int(day))) .exclude(is_active=False)
        else:
            posts = SMPost.objects.all().exclude(is_active=False)
        serializer = SMPostSerializer(posts, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        if not request.user.is_authenticated:
            return Response("Must be logged in", status=403)

        print(request.data)

        serializer = SMPostSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(last_edit_user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        print(serializer.errors);
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SMPostDetail(APIView):
    """
    Retrieve, update or delete a SMPost.
    """

    def get_object(self, post_id):

        try:
            return SMPost.objects.get(id=post_id)
        except SMPost.DoesNotExist:
            raise Http404

    def get(self, request, post_id, format=None):
        if not request.user.is_authenticated:
            return Response("Must be logged in", status=403)

        post = self.get_object(post_id)
        serializer = SMPostSerializer(post)
        return Response(serializer.data)

    def put(self, request, post_id, format=None):
        if not request.user.is_authenticated:
            return Response("Must be logged in", status=403)

        post = self.get_object(post_id)

        serializer = SMPostSerializer(post, data=request.data)
        if serializer.is_valid():
            b_should_update_copy_user = False
            update_copy_user_to = None
            b_should_update_online_user = False
            update_online_user_to = None

            #print(type(request.data["pub_ready_copy"]));

            if "pub_ready_copy" in request.data and post.pub_ready_copy != request.data["pub_ready_copy"]:
                # it means that the sender of this request tried to change it
                # we have to check if they have copy permissions
                #if request.user.group
                if request.user.groups.filter(name="Copy").count() <= 0: # user is not part of copy group
                    #  TODO: what data should the response send back
                    return Response({"error":"Permission denied"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    b_should_update_copy_user = True
                    if request.data["pub_ready_copy"]:
                        update_copy_user_to = request.user
                    else:
                        update_copy_user_to = None # means that the user marked it as not copy edited so clear the copy edited user
            if "pub_ready_online" in request.data and post.pub_ready_online != request.data["pub_ready_online"]:

                if request.user.groups.filter(name="Online").count() <= 0: # user is not part of group
                    return Response({"error":"Permission denied"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    b_should_update_online_user = True
                    if request.data["pub_ready_online"]:
                        update_online_user_to = request.user
                    else:
                        update_online_user_to = None

            post = serializer.save(last_edit_user=request.user)

            # if the user updated the copy edited or online approved status,
            # record them as the copy_user or online_user
            if b_should_update_copy_user:
                post.pub_ready_copy_user = update_copy_user_to

            if b_should_update_online_user:
                post.pub_ready_online_user = update_online_user_to

            if b_should_update_copy_user or b_should_update_online_user:
                post.save()

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id, format=None):
        if not request.user.is_authenticated:
            return Response("Must be logged in", status=403)

        post = self.get_object(post_id)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@login_required
def send_posts_now(request, post_id):
    if not request.user.is_authenticated:
        return Response("Must be logged in", status=403)

    if request.method == "POST":
        sendNowPost = SMPost.objects.get(id=post_id)
        if not sendNowPost.pub_ready_online:
            return JsonResponse({"error": "Post is not ready to publish"}, safe=True, status=409 )
        if not sendNowPost.pub_ready_copy:
            return JsonResponse({"error": "Post is not copy edited"}, safe=True, status=409 )
        sendNowPost.send_now = True
        sendNowPost.pub_date = timezone.localtime(timezone.now()).date()
        sendNowPost.pub_time = timezone.localtime(timezone.now()).time()
        sendNowPost.save()
        sendposts.delay()
        return JsonResponse({"error": ""}, safe=True)


def get_settings():
    return {
        "site_message": MeowSetting.objects.get(setting_key='site_message').setting_value,
        "send_posts": MeowSetting.objects.get(setting_key='send_posts').setting_value,
    }


def can_edit_post(user, post):
    if (user.has_perm('scheduler.add_edit_post') and
        (((user.has_perm('scheduler.approve_copy') or not post.pub_ready_copy) and
          (user.has_perm('scheduler.approve_online') or not post.pub_ready_online))
         or (user.has_perm('scheduler.approve_online')))
            and not post.sent):
        return True
    elif post.sent_error:
        return True
    return False


@login_required
def user_settings(request):
    user = request.user
    message = {}

    if request.method == "POST":
        message = {
            "mtype": "success",
            "mtext": "Your information has been updated",
        }

        first_name = request.POST.get('first_name', None)
        last_name = request.POST.get('last_name', None)
        password1 = request.POST.get('password1', None)
        password2 = request.POST.get('password2', None)
        email = request.POST.get('email', None)
        if first_name:
            user.first_name = first_name
        if last_name:
            user.last_name = last_name
        if password1 and password2 and (password1 == password2) and len(password1) > 5:
            user.set_password(password1)
        if password1 and password2 and (password1 != password2):
            message['mtext'] = "Your passwords don't match"
            message['mtype'] = "fail"
        if email:
            user.email = email
        user.save()

    site_message = MeowSetting.objects.get(
        setting_key='site_message').setting_value
    context = {
        "user": request.user,
        "message": message,
        "site_settings": get_settings(),
    }
    return render(request, 'scheduler/user_settings.html', context)


@login_required
def dashboard(request):
    messages = []
    message = {}
    has_delete_permission = request.user.has_perm('scheduler.add_edit_post')
    if request.method == "POST" and has_delete_permission:
        post_id = request.POST.get('post_id_to_delete', None)
        post = get_object_or_404(SMPost, pk=post_id)
        post.delete()
        message = {
            "mtype": "success",
            "mtext": "Your post was deleted",
        }

    alt_date = None
    if request.method == "GET":
        date_change_str = request.GET.get('date', None)
        if date_change_str:
            cal = pdt.Calendar()
            date_change = cal.parse(date_change_str)
            if date_change[1] == 1 or date_change[1] == 3:
                alt_date = datetime.date(
                    date_change[0][0], date_change[0][1], date_change[0][2])

    if alt_date:
        view_date = alt_date
    else:
        view_date = timezone.localdate()

    today_posts = SMPost.objects.filter(pub_date=view_date)
    lost_posts = SMPost.objects.filter(pub_date=None)

    site_message = MeowSetting.objects.get(
        setting_key='site_message').setting_value
    if request.session.get("message", None):
        temp_message = request.session.pop("message")
        messages.append({
            "mtype": "success",
            "mtext": temp_message,
        })
    messages.append(message)
    context = {
        "user": request.user,
        "sections": Section.objects.all(),
        # Turning this feature off for now
        # "smposts": zip(list(chain(today_posts, lost_posts)), get_analytics(list(chain(today_posts, lost_posts)))),
        "smposts": list(chain(today_posts, lost_posts)),
        "messages": messages,
        "view_date": view_date,
        "site_settings": get_settings()
    }
    return render(request, 'scheduler/dashboard.html', context)


@login_required
def edit(request, post_id, post=None):
    if not post:
        post = get_object_or_404(SMPost, pk=post_id)

    if (post.sent and not post.sent_error) or not can_edit_post(request.user, post) or post.sending:
        message = {
            "mtype": "status",
        }

        if post.sent:
            message['mtext'] = "This post has already been sent and cannot be edited"

        elif not can_edit_post(request.user, post):
            message['mtext'] = "You do not have permission to edit this post"

        elif post.sending:
            message['mtext'] = "This post is currently sending and cannot be edited"

        site_message = MeowSetting.objects.get(
            setting_key='site_message').setting_value
        context = {
            "user": request.user,
            "sections": Section.objects.all(),
            "post": post,
            "message": message,
            "site_settings": get_settings(),
        }
        return render(request, 'scheduler/view.html', context)

    message = {}
    if request.method == "POST" and can_edit_post(request.user, post):
        post.story_url = request.POST.get('url', None).strip(" \t\n\r")
        if len(post.story_url) > 4 and post.story_url[0:4] != "http":
            try:
                index_of_protocol = post.story_url.index("://")
                if index_of_protocol <= 5:
                    post.story_url = "http" + \
                        post.story_url[post.story_url.index("://"):]
            except:
                post.story_url = "http://" + post.story_url
        post.slug = request.POST.get('slug', None)
        try:
            post.section = Section.objects.get(
                pk=request.POST.get('section', None))
        except:
            post.section = None
        post.post_twitter = request.POST.get('tweet', None)
        post.post_facebook = request.POST.get('fb', None)
        post.post_instagram = request.POST.get('ig', None)
        post.post_notes = request.POST.get('notes', None)
        # date_str = request.POST.get('pub_date', None)
        # time_str = request.POST.get('pub_time', None)
        date_time_str = request.POST.get('pub_date_time', None)

        # Date
        cal = pdt.Calendar()
        date_parsed = cal.parse(date_time_str)
        time_parsed = cal.parse(date_time_str)
        if date_parsed[1] == 1 or date_parsed[1] == 3:
            post.pub_date = datetime.date(
                date_parsed[0][0], date_parsed[0][1], date_parsed[0][2])
            post.pub_time = datetime.time(time_parsed[0][3], time_parsed[0][4])
        else:
            post.pub_date = None
            post.pub_time = None

        # Time
        # time_parsed = cal.parse(time_str)
        # if time_parsed[1] == 2 or time_parsed[1] == 3:
        #     post.pub_time = datetime.time(time_parsed[0][3], time_parsed[0][4])
        # else:
        #     post.pub_time = None

        # Checkboxes
        if request.user.has_perm('scheduler.approve_copy'):
            if request.POST.get('approve-copy', False) == 'on':
                if post.pub_ready_copy == False:
                    post.pub_ready_copy_user = request.user
                post.pub_ready_copy = True
            else:
                post.pub_ready_copy = False
                post.pub_ready_copy_user = None

        if request.user.has_perm('scheduler.approve_online'):
            if request.POST.get('approve-online', False) == 'on':
                if post.pub_ready_online == False:
                    post.pub_ready_online_user = request.user
                post.pub_ready_online = True
            else:
                post.pub_ready_online = False
                post.sent_error = False
                post.sent = False
                post.pub_ready_online_user = None

        post.last_edit_user = request.user

        post.save()
        message = {
            "mtype": "success",
            "mtext": "Your changes were saved!",
        }
    if request.method == "GET" and request.user.has_perm('scheduler.add_edit_post'):
        if request.GET.get('add', None) == "true":
            message = {
                "mtype": "success",
                "mtext": "Your post was successfully created!",
            }

    site_message = MeowSetting.objects.get(
        setting_key='site_message').setting_value
    context = {
        "user": request.user,
        "sections": Section.objects.all(),
        "post": post,
        "today": timezone.localdate(),
        "message": message,
        "twitter_limit": MeowSetting.objects.get(setting_key='twitter_character_limit').setting_value,
        "site_settings": get_settings(),
    }
    return render(request, 'scheduler/edit.html', context)


@login_required
def add(request):
    if not request.user.has_perm('scheduler.add_edit_post'):
        return redirect('/')
    post_id = -1
    if request.method == "POST" and request.user.has_perm('scheduler.add_edit_post'):
        post = SMPost()
        edit(request, -1, post)
        post_id = post.id
        return redirect("/edit/" + str(post.id) + "/?add=true")

    site_message = MeowSetting.objects.get(
        setting_key='site_message').setting_value
    context = {
        "user": request.user,
        "sections": Section.objects.all(),
        "today": timezone.localdate(),
        "twitter_limit": MeowSetting.objects.get(setting_key='twitter_character_limit').setting_value,
        "site_settings": get_settings(),
    }
    return render(request, 'scheduler/edit.html', context)

# TODO: Can add_user is not a proper permission for this lol


def can_manage(user):
    return user.has_perm('auth.add_user')


@user_passes_test(can_manage)
def manage(request):
    message = {}
    old_fields = {}
    error = False
    action = None
    if request.method == "POST":
        action = request.POST.get('action', None)

    if request.method == "POST" and action == "meow-switch":
        send_posts = request.POST.get('switch-x', None)
        if send_posts:
            s = MeowSetting.objects.get(setting_key="send_posts")
            old = s.setting_value
            s.setting_value = send_posts
            s.save()
            if send_posts != old:
                message = {
                    "mtype": "success",
                    "mtext": "Meow status successfully changed. Be careful out there.",
                }

    if request.method == "POST" and action == "post-site-message":
        site_message = request.POST.get('site-message', None)
        s = MeowSetting.objects.get(setting_key="site_message")
        old = s.setting_value
        s.setting_value = site_message
        s.save()
        if site_message != old:
            message = {
                "mtype": "success",
                "mtext": "Site message successfully changed",
            }

    if request.method == "POST" and action == "add-user":
        try:
            old_fields['first_name'] = request.POST['first_name']
            old_fields['last_name'] = request.POST['last_name']
            old_fields['email'] = request.POST['email']
            old_fields['username'] = request.POST['username']
            old_fields['permission'] = request.POST['permission']
            password = User.objects.make_random_password()

            u = User(username=old_fields['username'], first_name=old_fields['first_name'],
                     last_name=old_fields['last_name'], email=old_fields['email'], password="bruin")
            u.save()
            u.set_password(password)
            u.groups.add(Group.objects.get(name=old_fields['permission']))
            u.save()

            message = {
                "mtype": "success",
                "mtext": "User added successfully!",
            }
        except KeyError as e:
            message = {
                "mtype": "alert",
                "mtext": "User not added; please fill out all fields!",
            }
            error = True
        except IntegrityError as e:
            message = {
                "mtype": "alert",
                "mtext": "Username " + old_fields['username'] + " already exists",
            }
            error = True

        # Now send them an email with the username/pass
        if not error:
            try:
                email_message = """
Hey {first_name},

Your new Meow account is ready. Log in with:

Username: {username}
Password: {password}

at {site_url} and change your password.

Thanks,
{organization_name}
                """
                site_url = MeowSetting.objects.get(
                    setting_key='site_url').setting_value
                organization_name = MeowSetting.objects.get(
                    setting_key='organization_name').setting_value
                from_email = MeowSetting.objects.get(
                    setting_key='from_email').setting_value

                email_message = email_message.format(
                    first_name=old_fields['first_name'], username=old_fields['username'], password=password, site_url=site_url, organization_name=organization_name)
                send_mail('[' + organization_name + '] Your new meow account',
                          email_message, from_email, [old_fields['email']], fail_silently=False)
                old_fields = {}
            except:
                print(sys.exc_info()[0])
                message = {
                    "mtype": "alert",
                    "mtext": "Account created but couldn't send password to " + old_fields['email'] + ".",
                }
                old_fields = {}
                error = True

    send_posts = MeowSetting.objects.get(
        setting_key='send_posts').setting_value
    site_message = MeowSetting.objects.get(
        setting_key='site_message').setting_value

    TWITTER_CONSUMER_KEY = MeowSetting.objects.get(
        setting_key='twitter_consumer_key').setting_value
    TWITTER_CONSUMER_SECRET = MeowSetting.objects.get(
        setting_key='twitter_consumer_secret').setting_value

    twitter_auth = tweepy.OAuthHandler(
        TWITTER_CONSUMER_KEY,
        TWITTER_CONSUMER_SECRET,
        MeowSetting.objects.get(
            setting_key="site_url").setting_value + "/api/v1/twitter-connect/"
    )
    twitter_auth.secure = True
    twitter_auth_url = twitter_auth.get_authorization_url()
    request.session["twitter_auth_token"] = twitter_auth.request_token
    request.session.save()

    fb_app_id = MeowSetting.objects.get(setting_key="fb_app_id").setting_value
    fb_app_secret = MeowSetting.objects.get(
        setting_key="fb_app_secret").setting_value

    # TODO: find a better place for these constants
    fb_authorization_base_url = 'https://www.facebook.com/v2.10/dialog/oauth'
    fb_token_url = 'https://graph.facebook.com/oauth/access_token'
    redirect_uri = MeowSetting.objects.get(
        setting_key="site_url").setting_value + '/api/v1/fb-connect'
    fb_permissions = ["manage_pages", "publish_pages"]

    facebook = OAuth2Session(fb_app_id,
                             redirect_uri=redirect_uri,
                             scope=fb_permissions)
    facebook = facebook_compliance_fix(facebook)
    facebook_auth_url, state = facebook.authorization_url(
        fb_authorization_base_url)

    context = {
        "user": request.user,
        "message": message,
        "old_fields": old_fields,
        "send_posts": send_posts,
        "site_settings": get_settings(),
        "twitter_auth_url": twitter_auth_url,
        "facebook_auth_url": facebook_auth_url,
        "fb_app_id": fb_app_id
    }
    return render(request, 'scheduler/manage.html', context)


def twitter_redir(request):
    TWITTER_CONSUMER_KEY = MeowSetting.objects.get(
        setting_key='twitter_consumer_key').setting_value
    TWITTER_CONSUMER_SECRET = MeowSetting.objects.get(
        setting_key='twitter_consumer_secret').setting_value

    twitter_auth = tweepy.OAuthHandler(
        TWITTER_CONSUMER_KEY,
        TWITTER_CONSUMER_SECRET,
        MeowSetting.objects.get(
            setting_key="site_url").setting_value + '/api/v1/twitter-connect/'
    )
    twitter_auth.secure = True
    twitter_auth_url = twitter_auth.get_authorization_url()
    request.session["twitter_auth_token"] = twitter_auth.request_token
    request.session.save()
    return redirect(twitter_auth_url)


# @user_passes_test(can_manage)
def twitter_connect(request):
    print("INSIDE TWITTER CONNECT")
    context = {
        "user": request.user,
        "site_settings": get_settings(),
        "sections": Section.objects.all(),
    }
    if request.method == "POST" and request.POST.get("action", None) == "connect":
        print("here")
        try:
            TWITTER_CONSUMER_KEY = MeowSetting.objects.get(
                setting_key='twitter_consumer_key').setting_value
            print(TWITTER_CONSUMER_KEY)
            TWITTER_CONSUMER_SECRET = MeowSetting.objects.get(
                setting_key='twitter_consumer_secret').setting_value
            print(TWITTER_CONSUMER_SECRET)
            twitter_auth = tweepy.OAuthHandler(
                TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET)
            twitter_auth.secure = True
            token = request.session['twitter_auth_token']
            twitter_auth.request_token = token
            twitter_auth.get_access_token(request.POST.get("verifier", None))
            section = Section.objects.get(
                pk=request.POST.get("section_id", None))
        except:
            errMessage = sys.exc_info()[0]
            context["message"] = {
                "mtype": "alert",
                "mtext": "Error: Couldn't connect to your account. Try again.",
            }
            return render(request, 'scheduler/twitter_connect.html', context)

        section.twitter_access_key = twitter_auth.access_token
        section.twitter_access_secret = twitter_auth.access_token_secret
        section.twitter_account_handle = None
        section.save()
        try:
            # If this fails it doesn't matter; it's just a screen name
            api = tweepy.API(twitter_auth)
            screen_name = api.me().screen_name
            section.twitter_account_handle = screen_name
            section.save()
        except:
            pass
        request.session["message"] = "Twitter account, @" + \
            screen_name + ", successfully added."
        request.session.save()
        return redirect("/")

    else:
        print("there")
        token = request.GET.get("oauth_token", None)
        print(token)
        verifier = request.GET.get("oauth_verifier", None)
        print(verifier)
        message = {}
        if not (token and verifier):
            message["mtype"] = "alert"
            message["mtext"] = "Connection to Twitter failed; try again and be sure to authorize the application."
        context["message"] = message
        context["token"] = token
        context["verifier"] = verifier
        return render(request, 'twit-connect.html', context)


def fb_redir(request):
    fb_app_id = MeowSetting.objects.get(setting_key="fb_app_id").setting_value
    fb_app_secret = MeowSetting.objects.get(
        setting_key="fb_app_secret").setting_value

    # TODO: find a better place for these constants
    fb_authorization_base_url = 'https://www.facebook.com/v2.10/dialog/oauth'
    fb_token_url = 'https://graph.facebook.com/oauth/access_token'
    redirect_uri = MeowSetting.objects.get(
        setting_key="site_url").setting_value + '/api/v1/fb-connect/'
    fb_permissions = ["manage_pages", "publish_pages"]

    facebook = OAuth2Session(fb_app_id,
                             redirect_uri=redirect_uri,
                             scope=fb_permissions)
    facebook = facebook_compliance_fix(facebook)
    facebook_auth_url, state = facebook.authorization_url(
        fb_authorization_base_url)
    return redirect(facebook_auth_url)

# TODO: fix to use this
# @user_passes_test(can_manage)


def fb_connect(request):
    context = {
        "user": request.user,
        "site_settings": get_settings(),
        "sections": Section.objects.all(),
    }
    # Process after selecting section/page
    if request.method == "POST" and request.POST.get("action", None) == "connect":
        try:
            pages_info = request.session.pop("fb_pages_info")
            page_id = request.POST.get("page_id")
            for page_info in pages_info:
                if page_info["id"] == page_id:
                    page_token = page_info["access_token"]
                    page_name = page_info["name"]
            section = Section.objects.get(
                pk=request.POST.get("section_id", None))
            section.facebook_page_id = page_id
            section.facebook_account_handle = page_name
            section.facebook_key = page_token
            section.save()
        except:
            # TODO: make this have a red color
            request.session["message"] = "ERROR: Could not connect. Try again"

        request.session["message"] = "Successfully linked Facebook page " + \
            page_name + " to section " + section.name
        request.session.save()
        return redirect("/")

    # Print an error or print the form
    else:
        # code = request.GET.get("code", None)
        # fb_app_id = MeowSetting.objects.get(
        #     setting_key="fb_app_id").setting_value
        # site_url = MeowSetting.objects.get(
        #     setting_key="site_url").setting_value
        # fb_app_secret = MeowSetting.objects.get(
        #     setting_key="fb_app_secret").setting_value
        # request_endpoint = "https://graph.facebook.com/oauth/access_token?client_id=" + fb_app_id + \
        #     "&redirect_uri=" + site_url + "/manage/fb-connect/&client_secret=" + \
        #     fb_app_secret + "&code=" + code
        # response = requests.get(request_endpoint).text
        # regex = re.search("access_token=([^&]*)($|&$|&.+)$", response)
        # token = regex.group(1)
        token = ""
        pages_info = {}

        fb_app_id = MeowSetting.objects.get(
            setting_key="fb_app_id").setting_value
        fb_app_secret = MeowSetting.objects.get(
            setting_key="fb_app_secret").setting_value

        fb_token_url = 'https://graph.facebook.com/oauth/access_token'
        redirect_uri = MeowSetting.objects.get(
            setting_key="site_url").setting_value + '/api/v1/fb-connect/'

        fb_code = request.GET.get('code', None)
        fb_permissions = ["manage_pages", "publish_pages"]

        facebook = OAuth2Session(fb_app_id,
                                 redirect_uri=redirect_uri,
                                 scope=fb_permissions)
        facebook = facebook_compliance_fix(facebook)
        fb_token = facebook.fetch_token(
            fb_token_url,
            client_secret=fb_app_secret,
            code=fb_code)
        token = fb_token['access_token']

        extended_token = facepy.utils.get_extended_access_token(
            token, fb_app_id, fb_app_secret)
        api = facepy.GraphAPI(oauth_token=extended_token[0])
        raw_pages_info = api.get("/me/accounts/")
        pages_info = []
        for page in raw_pages_info[u'data']:
            page_info = {
                'access_token': page[u'access_token'],
                'name': page[u'name'],
                'id': page[u'id'],
            }
            pages_info.append(page_info)
        request.session["fb_pages_info"] = pages_info
        request.session.save()

        message = {}
        if not (pages_info):
            message["mtype"] = "alert"
            message["mtext"] = "Connection to Facebook failed; try again and be sure to authorize the application and all its permissions and be sure your account is an administrator on the page."
        context["message"] = message
        context["pages"] = pages_info
        return render(request, 'fb-connect.html', context)


def logout(request):
    return logout(request)

@api_view(['GET'])
def get_history(request, post_id):
    """
    returns a list of all histories of a post given post_id.
    Results are sorted in chronological order with newest first.
    """
    if len(SMPost.objects.filter(id=post_id)) == 0:
        return Response(status=status.HTTP_404_NOT_FOUND)
    hists = PostHistory.objects.filter(smpost_id=post_id).order_by('-creation_time')

    serializer = PostHistorySerializer(hists, many=True)
    return Response(serializer.data)

@receiver(post_save, sender=SMPost) #receiver for specific field change in model
def update_scheduler(sender, instance, **kwargs):


@receiver(post_save, sender=SMPost)
def new_history(sender, instance, **kwargs):
    """
    receiver listens on a `save' event on the model SMPost.
    Whenever a SMPost is saved, this function is called.
    It compares the new post to its previous version.
    If old version has the same content,
        return immediately without saving
    else,
        create a new history object

    Parameters:
    sender: the model that triggered a save. It should always be SMPost
    instance: the instance of the object being saved

    Returns:
    None
    """
    # optimization to check if top of the history stack is the same
    ph = PostHistory.objects.filter(smpost_id=instance.id).order_by('-creation_time')
    past_history = list(ph)
    if len(past_history) >= 1:
        prev_fb = past_history[0].post_facebook
        prev_tw = past_history[0].post_twitter
        prev_n = past_history[0].post_newsletter
        # if newest history is the same we return
        if prev_n == instance.post_newsletter and prev_fb == instance.post_facebook and prev_tw == instance.post_twitter:
            return

    otherPostsAtTime = SMPost.objects.filter(pub_date = instance.pub_date).filter(pub_time = instance.pub_time).exclude(smpost_id = instance.id)


    PostHistory.objects.create(
        smpost=instance,
        post_twitter=instance.post_twitter,
        post_facebook=instance.post_facebook,
        post_newsletter=instance.post_newsletter,
        last_edit_user=instance.last_edit_user,
        )
    listOtherPostsAtTime =list(otherPostsAtTime)
    if otherPostsAtTime:
        #Do cron magic
