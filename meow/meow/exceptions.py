class KerckhoffCustomException(Exception):
    status_code = None
    error_message = None
    is_an_error_response = True

    def __init__(self, error_message):
        Exception.__init__(self)
        self.error_message = error_message

    def to_dict(self):
        return {'message': self.error_message}


class UserError(KerckhoffCustomException):
    status_code = 400


class AuthenticationRequired(KerckhoffCustomException):
    status_code = 403
    error_message = "Login is required to use this resource"

    def __init__(self):
        Exception.__init__(self)
