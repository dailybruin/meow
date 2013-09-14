from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import redirect

@login_required
def dashboard(request):
    return HttpResponse("This is the dashbaord")

def logout(request):
    return logout(request)