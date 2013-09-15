from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect, render
from scheduler.models import *

@login_required
def dashboard(request):
    context = {
        "user" : request.user,
        "sections" : Section.objects.all(),
        "smposts" : SMPost.objects.all(),
    }
    return render(request, 'scheduler/dashboard.html', context)

def logout(request):
    return logout(request)