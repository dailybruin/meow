from django.shortcuts import redirect, render, get_object_or_404


def base(request):
    return render(request, 'base.html')
