from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse

@login_required
def dashboard(request):
    return HttpResponse("This is the dashbaord")

def login(request):
    username = request.POST['username']
    password = request.POST['password']
    if not username or not password:
        return HttpResponse("Forgot to send me data")
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            return HttpResponse("You are logged in")
        else:
            return HttpResponse("Your account is disabled")
    else:
        return HttpResponse("Account info incorrect")
    