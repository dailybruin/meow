import requests
import re
from django.shortcuts import redirect, render, get_object_or_404
from django.template.loader import get_template
from django.http import JsonResponse

# For health check
from scheduler.management.healthcheck import HealthCheck

def base(request):
    #print("BASE")
    return render(request, 'base.html')

def healthcheck(request):
    (healthy, message) = HealthCheck.healthCheck()

    # Set up JSON Response
    data = {
            'healthy': str(healthy),
            'message': message if message else ''
        }

    return JsonResponse(data, status=(500 if not healthy else 200))

# Test only, sets program to unhealthy state
def healthchecktest(request):
    msg = request.GET.get('msg', '')

    print('Health Check Test: ' + msg, flush=True)

    HealthCheck.setUnhealthy(msg if msg else None)
    return JsonResponse({'message': 'ok'})