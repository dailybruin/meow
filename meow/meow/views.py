import requests
import re
from django.shortcuts import redirect, render, get_object_or_404
from django.template.loader import get_template

def base(request):
    #print("BASE")
    return render(request, 'base.html')
