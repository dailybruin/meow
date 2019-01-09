from functools import wraps
from typing import List, Callable
from django.contrib.auth import get_user_model, authenticate


def api_login_required():
    """Enforces user authentication for a particular endpoint

    Example:
        @api_login_required()
        def my_view(request):
            ...

    Keyword Arguments:
        methods {List[str]} -- The HTTP verbs that require authentication (default: {["POST", "PUT", "PATCH", "DELETE"]})

    Raises:
        AuthenticationRequired -- A KerckhoffCustomException that authentication is necessary

    Returns:
        the wrapped function
    """
    def decorator(function):
        @wraps(function)
        def wrap(request, *args, **kwargs):
            if not request.user.is_authenticated:
                print("NOT AUTHENTICATED")
                print(request.user)
                raise Exception
            else:
                return function(request, *args, **kwargs)
        return wrap
    return decorator
