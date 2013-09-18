from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect, render, get_object_or_404
from scheduler.models import *
import datetime
import parsedatetime.parsedatetime as pdt
from itertools import chain

def can_edit_post(user, post):
    if (user.has_perm('scheduler.add_edit_post') and
        (((user.has_perm('scheduler.approve_copy') or not post.pub_ready_copy) and
        (user.has_perm('scheduler.approve_online') or not post.pub_ready_online))
        or (user.has_perm('scheduler.approve_online')))
        and not post.sent):
        return True
    return False

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

    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "smposts" : list(chain(tomorrow_posts, lost_posts)),
        "message" : message,
        "view_date" : view_date,
    }
    return render(request, 'scheduler/dashboard.html', context)

@login_required
def edit(request, post_id, post=None):
    if not post:
        post = get_object_or_404(SMPost, pk=post_id)
    
    if post.sent or not can_edit_post(request.user, post):
        message = {
            "mtype":"status",
        }
        
        if not can_edit_post(request.user, post):
            message['mtext'] = "You do not have permission to edit this post"
        
        if post.sent:
            message['mtext'] = "This post has already been sent and cannot be edited"
        
        context = {
            "user" : request.user,
            "sections" : Section.objects.all(),
            "post" : post,
            "message" : message,
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
                post.pub_ready_copy = True
            else:
                post.pub_ready_copy = False
        
        if request.user.has_perm('scheduler.approve_online'):
            if request.POST.get('approve-online',False) == 'on':
                post.pub_ready_online = True
            else:
                post.pub_ready_online = False
            
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

    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "post" : post,
        "tomorrow" : datetime.date.today() + datetime.timedelta(days=1),
        "message" : message,
        "twitter_limit" : MeowSetting.objects.get(setting_key='twitter_character_limit').setting_value,
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
        
    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "tomorrow" : datetime.date.today() + datetime.timedelta(days=1),
        "twitter_limit" : MeowSetting.objects.get(setting_key='twitter_character_limit').setting_value,
    }
    return render(request, 'scheduler/edit.html', context)

def logout(request):
    return logout(request)