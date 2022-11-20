from typing import Optional, Tuple, List

'''
Utils class to check app health.
Used for Kubernetes to automatically restart app when critical errors occur.

Process:
    1. A critical error occurs
    2. HealthCheck receives notification of this via setUnhealthy(msg: Optional[str]) method
    3. HealthCheck keeps changes program state to unhealthy, and keeps track of the message
    4. A routine call to the healthcheck API occurs
        a. API calls healthCheck() which returns current status
        b. If program not in healthy state, API returns 500 status code along with messages
        c. If program is healthy, API returns 200 OK
'''
class HealthCheck(object):
    # Static var
    _healthy = True
    _message: List[str] = []

    # Used to set global healthiness, with optional message
    @staticmethod
    def setUnhealthy(message: Optional[str] = None) -> None:
        HealthCheck._healthy = False

        if message:
            HealthCheck._message.append(message)

    # Returns global healthiness
    @staticmethod
    def healthCheck() -> Tuple[bool, str]:
        return (HealthCheck._healthy, HealthCheck._message)