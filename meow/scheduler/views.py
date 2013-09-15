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
    if request.method == "POST":
        print request.POST.get('url',None)
    post = get_object_or_404(SMPost, pk=post_id)
    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "post" : post,
    }
    return render(request, 'scheduler/edit.html', context)

def logout(request):
    return logout(request)