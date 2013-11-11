from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import HttpResponse
from django.shortcuts import redirect, render, get_object_or_404
from scheduler.models import *
import datetime
import parsedatetime.parsedatetime as pdt
from itertools import chain
from django.contrib.auth.models import User
from django.db import IntegrityError
from django.core.mail import send_mail
from django.contrib.auth.models import User, Group
import sys


def get_settings():
    return {
        "site_message" : MeowSetting.objects.get(setting_key='site_message').setting_value,
        "send_posts" : MeowSetting.objects.get(setting_key='send_posts').setting_value,
    }

def can_edit_post(user, post):
    if (user.has_perm('scheduler.add_edit_post') and
        (((user.has_perm('scheduler.approve_copy') or not post.pub_ready_copy) and
        (user.has_perm('scheduler.approve_online') or not post.pub_ready_online))
        or (user.has_perm('scheduler.approve_online')))
        and not post.sent):
        return True
    return False

@login_required
def user_settings(request):
    user = request.user
    message = {}
    
    if request.method == "POST":
        message = {
            "mtype":"success",
            "mtext":"Your information has been updated",
        }
        
        first_name = request.POST.get('first_name',None)
        last_name = request.POST.get('last_name',None)
        password1 = request.POST.get('password1',None)
        password2 = request.POST.get('password2',None)
        email = request.POST.get('email',None)
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
            
    site_message = MeowSetting.objects.get(setting_key='site_message').setting_value
    context = {
        "user" : request.user,
        "message" : message,
        "site_settings" : get_settings(),
    }
    return render(request, 'scheduler/user_settings.html', context)

@login_required
def dashboard(request):
    message = {}
    has_delete_permission = request.user.has_perm('scheduler.add_edit_post')
    if request.method == "POST" and has_delete_permission:
        post_id = request.POST.get('post_id_to_delete',None)
        post = get_object_or_404(SMPost, pk=post_id)
        post.delete()
        message = {
            "mtype":"success",
            "mtext":"Your post was deleted",
        }
        
    alt_date = None
    if request.method == "GET":
        date_change_str = request.GET.get('date',None)
        if date_change_str:
            cal = pdt.Calendar()
            date_change = cal.parse(date_change_str)
            if date_change[1] == 1 or date_change[1] == 3:
                alt_date = datetime.date(date_change[0][0], date_change[0][1], date_change[0][2])

    if alt_date:
        view_date = alt_date
    else:
        if datetime.datetime.now().hour <= 4:
            view_date = datetime.date.today()
        else:
            view_date = datetime.date.today() + datetime.timedelta(days=1)

    tomorrow_posts = SMPost.objects.filter(pub_date=view_date)
    lost_posts = SMPost.objects.filter(pub_date=None)

    site_message = MeowSetting.objects.get(setting_key='site_message').setting_value
    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "smposts" : list(chain(tomorrow_posts, lost_posts)),
        "message" : message,
        "view_date" : view_date,
        "site_settings" : get_settings(),
    }
    return render(request, 'scheduler/dashboard.html', context)

@login_required
def edit(request, post_id, post=None):
    if not post:
        post = get_object_or_404(SMPost, pk=post_id)
    
    if post.sent or not can_edit_post(request.user, post) or post.sending:
        message = {
            "mtype":"status",
        }
        
        if not can_edit_post(request.user, post):
            message['mtext'] = "You do not have permission to edit this post"
        
        elif post.sent:
            message['mtext'] = "This post has already been sent and cannot be edited"
        
        elif post.sending:
            message['mtext'] = "This post is currently sending and cannot be edited"
        
        site_message = MeowSetting.objects.get(setting_key='site_message').setting_value
        context = {
            "user" : request.user,
            "sections" : Section.objects.all(),
            "post" : post,
            "message" : message,
            "site_settings" : get_settings(),
        }
        return render(request, 'scheduler/view.html', context)
    
    
    message = {}
    if request.method == "POST" and can_edit_post(request.user, post):
        post.story_url = request.POST.get('url',None)
        post.slug = request.POST.get('slug',None)
        try:
            post.section = Section.objects.get(pk=request.POST.get('section',None))
        except:
            post.section = None
        post.post_twitter = request.POST.get('tweet',None)
        post.post_facebook = request.POST.get('fb',None)
        date_str = request.POST.get('pub_date',None)
        time_str = request.POST.get('pub_time',None)
        
        # Date
        cal = pdt.Calendar()
        date_parsed = cal.parse(date_str)
        if date_parsed[1] == 1 or date_parsed[1] == 3:
            post.pub_date = datetime.date(date_parsed[0][0], date_parsed[0][1], date_parsed[0][2])
        else:
            post.pub_date = None
            
        # Time
        time_parsed = cal.parse(time_str)
        if time_parsed[1] == 2 or time_parsed[1] == 3:
            post.pub_time = datetime.time(time_parsed[0][3], time_parsed[0][4])
        else:
            post.pub_time = None
        
        # Checkboxes
        if request.user.has_perm('scheduler.approve_copy'):
            if request.POST.get('approve-copy',False) == 'on':
                if post.pub_ready_copy == False:
                    post.pub_ready_copy_user = request.user
                post.pub_ready_copy = True
            else:
                post.pub_ready_copy = False
                post.pub_ready_copy_user = None
        
        if request.user.has_perm('scheduler.approve_online'):
            if request.POST.get('approve-online',False) == 'on':
                if post.pub_ready_online == False:
                    post.pub_ready_online_user = request.user
                post.pub_ready_online = True
            else:
                post.pub_ready_online = False
                post.pub_ready_online_user = None
            
        post.last_edit_user = request.user
        
        post.save()
        message = {
            "mtype":"success",
            "mtext":"Your changes were saved!",
        }
    if request.method == "GET" and request.user.has_perm('scheduler.add_edit_post'):
        if request.GET.get('add',None) == "true":
            message = {
                "mtype":"success",
                "mtext":"Your post was successfully created!",
            }

    site_message = MeowSetting.objects.get(setting_key='site_message').setting_value
    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "post" : post,
        "tomorrow" : datetime.date.today() + datetime.timedelta(days=1),
        "message" : message,
        "twitter_limit" : MeowSetting.objects.get(setting_key='twitter_character_limit').setting_value,
        "site_settings" : get_settings(),
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
        return redirect("/edit/"+str(post.id)+"/?add=true")
        
    site_message = MeowSetting.objects.get(setting_key='site_message').setting_value
    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "tomorrow" : datetime.date.today() + datetime.timedelta(days=1),
        "twitter_limit" : MeowSetting.objects.get(setting_key='twitter_character_limit').setting_value,
        "site_settings" : get_settings(),
    }
    return render(request, 'scheduler/edit.html', context)
    
    
def can_manage(user):
    return user.has_perm('add_user')    
@user_passes_test(can_manage)
def manage(request):
    message = {}
    old_fields = {}
    error = False;
    action = None
    if request.method == "POST":
        action = request.POST.get('action',None)
    
    if request.method == "POST" and action == "meow-switch":
        send_posts = request.POST.get('switch-x', None)
        if send_posts:
            s = MeowSetting.objects.get(setting_key="send_posts")
            old = s.setting_value
            s.setting_value = send_posts
            s.save()
            if send_posts != old:
                message = {
                    "mtype":"success",
                    "mtext":"Meow status successfully changed. Be careful out there.",
                }
                
    if request.method == "POST" and action == "post-site-message":
        site_message = request.POST.get('site-message', None)
        s = MeowSetting.objects.get(setting_key="site_message")
        old = s.setting_value
        s.setting_value = site_message
        s.save()
        if site_message != old:
            message = {
                "mtype":"success",
                "mtext":"Site message successfully changed",
            }
    
    if request.method == "POST" and action == "add-user":
        try:
            old_fields['first_name'] = request.POST['first_name']
            old_fields['last_name'] = request.POST['last_name']
            old_fields['email'] = request.POST['email']
            old_fields['username'] = request.POST['username']
            old_fields['permission'] = request.POST['permission']
            password = User.objects.make_random_password()
            
            u = User(username=old_fields['username'], first_name=old_fields['first_name'], last_name=old_fields['last_name'], email=old_fields['email'], password="bruin")
            u.save()
            u.set_password(password)
            u.groups.add(Group.objects.get(name=old_fields['permission']))
            u.save()
            
            message = {
                "mtype":"success",
                "mtext":"User added successfully!",
            }
        except KeyError as e:
            message = {
                "mtype":"alert",
                "mtext":"User not added; please fill out all fields!",
            }
            error=True;
        except IntegrityError as e:
            message = {
                "mtype":"alert",
                "mtext":"Username "+ old_fields['username'] +" already exists",
            }
            error=True;
            
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
                site_url = MeowSetting.objects.get(setting_key='site_url').setting_value
                organization_name = MeowSetting.objects.get(setting_key='organization_name').setting_value
                from_email = MeowSetting.objects.get(setting_key='from_email').setting_value
                
                email_message = email_message.format(first_name=old_fields['first_name'], username=old_fields['username'], password=password, site_url=site_url, organization_name=organization_name)
                send_mail('['+organization_name+'] Your new meow account', email_message, from_email, [old_fields['email']], fail_silently=False)
                old_fields={}
            except:
                print sys.exc_info()[0]
                message = {
                    "mtype":"alert",
                    "mtext":"Account created but couldn't send password to "+old_fields['email']+".",
                }
                old_fields={}
                error = True
    
    send_posts = MeowSetting.objects.get(setting_key='send_posts').setting_value
    site_message = MeowSetting.objects.get(setting_key='site_message').setting_value
    context = {
        "user" : request.user,
        "message" : message,
        "old_fields" : old_fields,
        "send_posts" : send_posts,
        "site_settings" : get_settings(),
    }
    return render(request, 'scheduler/manage.html', context)
    

def logout(request):
    return logout(request)