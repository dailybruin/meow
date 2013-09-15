from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect, render, get_object_or_404
from scheduler.models import *

@login_required
def dashboard(request):
    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "smposts" : SMPost.objects.all(),
    }
    return render(request, 'scheduler/dashboard.html', context)

@login_required
def edit(request, post_id):
    post = get_object_or_404(SMPost, pk=post_id)
    
    if request.method == "POST":
        post.story_url = request.POST.get('url',None)
        post.slug = request.POST.get('slug',None)
        post.section = Section.objects.get(pk=request.POST.get('section',None))
        post.post_twitter = request.POST.get('tweet',None)
        post.post_facebook = request.POST.get('fb',None)
        if request.POST.get('approve-copy',False) == 'on':
            post.pub_ready_copy = True
        else:
            post.pub_ready_copy = False
        
        if request.POST.get('approve-online',False) == 'on':
            post.pub_ready_online = True
        else:
            post.pub_ready_online = False
        
        
        post.save()
        print request.POST.get('url',None)
    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "post" : post,
    }
    return render(request, 'scheduler/edit.html', context)

def logout(request):
    return logout(request)