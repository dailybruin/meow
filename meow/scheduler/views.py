from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect, render, get_object_or_404
from scheduler.models import *
import datetime
import parsedatetime.parsedatetime as pdt

@login_required
def dashboard(request):
    message = {}
    if request.method == "POST":
        post_id = request.POST.get('post_id_to_delete',None)
        post = get_object_or_404(SMPost, pk=post_id)
        post.delete()
        message = {
            "mtype":"success",
            "mtext":"Your post was deleted",
        }

    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "smposts" : SMPost.objects.all(),
        "message" : message,
    }
    return render(request, 'scheduler/dashboard.html', context)

@login_required
def edit(request, post_id, post=None):
    if not post:
        post = get_object_or_404(SMPost, pk=post_id)
    
    if post.sent:
        message = {
            "mtype":"status",
            "mtext":"This post has already been sent and cannot be edited",
        }
        
        context = {
            "user" : request.user,
            "sections" : Section.objects.all(),
            "post" : post,
            "message" : message,
        }
        return render(request, 'scheduler/view.html', context)
    
    
    message = {}
    if request.method == "POST":
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
        if request.POST.get('approve-copy',False) == 'on':
            post.pub_ready_copy = True
        else:
            post.pub_ready_copy = False
        
        if request.POST.get('approve-online',False) == 'on':
            post.pub_ready_online = True
        else:
            post.pub_ready_online = False
            
        post.save()
        message = {
            "mtype":"success",
            "mtext":"Your changes were saved!",
        }
    if request.method == "GET":
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
    }
    return render(request, 'scheduler/edit.html', context)
    
@login_required
def add(request):
    post_id = -1
    if request.method == "POST":
        post = SMPost()
        edit(request, -1, post)
        post_id = post.id
        return redirect("/edit/"+str(post.id)+"/?add=true")
        
    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "tomorrow" : datetime.date.today() + datetime.timedelta(days=1),
    }
    return render(request, 'scheduler/edit.html', context)

def logout(request):
    return logout(request)