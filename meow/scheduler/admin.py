from django.contrib import admin
from scheduler.models import SMPost, Section, MeowSetting, EmailNotification

admin.site.register(SMPost)
admin.site.register(Section)
admin.site.register(MeowSetting)
admin.site.register(EmailNotification)
