from functools import wraps
from typing import List, Callable
from django.contrib.auth import get_user_model, authenticate
from meow.exceptions import AuthenticationRequired
from django.http import JsonResponse

def api_login_required():
    """Enforces user authentication for a particular endpoint

    Example:
        @api_login_required()
        def my_view(request):
            ...

    Keyword Arguments:
        methods {List[str]} -- The HTTP verbs that require authentication (default: {["POST", "PUT", "PATCH", "DELETE"]})

    Returns:
        the wrapped function
    """
    def decorator(function):
        @wraps(function)
        def wrap(request, *args, **kwargs):
            if not request.user.is_authenticated:
                print("NOT AUTHENTICATED")
                print(request.user)
                return JsonResponse({'error': 'Must be logged in'}, status=401)
            else:
                return function(request, *args, **kwargs)
        return wrap
    return decorator
