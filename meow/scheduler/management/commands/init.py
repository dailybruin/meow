from django.core.management.base import BaseCommand, CommandError
from scheduler.models import MeowSetting
from django.contrib.auth.models import Group, Permission



class Command(BaseCommand):
    help = "Sets default database settings"
    
    def set_preference(self, machine_name, human_name, default=""):
        if MeowSetting.objects.filter(setting_key=machine_name).count() > 0:
            return
        input_string = human_name
        if default is not "" and default is not None:
            input_string = input_string + " ("+default+")"
        input_string = input_string + ": "
        
        user_input = raw_input(input_string)
        if user_input is "":
            user_input = default
        s = MeowSetting(setting_key=machine_name, setting_value=user_input)
        s.save()
    
    def handle(self, *args, **options):
        self.set_preference("twitter_consumer_key", "Twitter consumer key")
        self.set_preference("twitter_consumer_secret", "Twitter consumer secret")
        self.set_preference("fb_app_id", "Facebook app ID")
        self.set_preference("fb_app_secret", "Facebook app secret")
        self.set_preference("fb_default_photo", "Default facebook icon", "http://dailybruin.com/images/2013/01/dailybruinicon2.jpeg")
        self.set_preference("twitter_character_limit", "Twitter character limit", "92")
        self.set_preference("bitly_access_token", "Bit.ly access token")
        self.set_preference("site_url", "Meow URL", "http://meow.dailybruin.com")
        self.set_preference("organization_name", "Organization Name", "Daily Bruin Online")
        self.set_preference("from_email", "Email (from)", "noreply@dailybruin.com")
        self.set_preference("send_posts","Send posts","Yes")
        self.set_preference("site_message","Site message (blank)")
        self.set_preference("default_image_selector", "Default featured image selector", "img.wp-post-image")
        
        # Configure gruops
        if Group.objects.filter(name='Editors').count() == 0:
            group_editors = Group(name='Editors')
            group_editors.save()
            group_editors.permissions.add(Permission.objects.get(codename='add_edit_post'))
            group_editors.save()
        
        if Group.objects.filter(name='Copy').count() == 0:
            group_copy = Group(name='Copy')
            group_copy.save()
            group_copy.permissions.add(Permission.objects.get(codename='add_edit_post'))
            group_copy.permissions.add(Permission.objects.get(codename='approve_copy'))
            group_copy.save()
        
        if Group.objects.filter(name='Online').count() == 0:
            group_online = Group(name='Online')
            group_online.save()        
            group_online.permissions.add(Permission.objects.get(codename='add_edit_post'))
            group_online.permissions.add(Permission.objects.get(codename='approve_copy'))
            group_online.permissions.add(Permission.objects.get(codename='approve_online'))
            group_online.save()        
        
        
