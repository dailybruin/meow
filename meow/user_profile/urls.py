from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns

from . import views

urlpatterns = [
    url(r'', views.redirectToSlack),
    url(r'^profile/$',
        views.UserProfileList.as_view(),
        name='profile-list'),
    url(r'^profile/(?P<user_id>[0-9]+)$',
        views.UserProfileDetail.as_view(),
        name='profile-detail'),
    # url(r'^social-user/(?P<user_id>[0-9]+)$',
    #     views.SocialUserDetail.as_view(),
    #     name='social-list'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
