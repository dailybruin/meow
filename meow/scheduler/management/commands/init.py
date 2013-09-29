from django.core.management.base import BaseCommand, CommandError
from scheduler.models import MeowSetting

class Command(BaseCommand):
    help = "Sends the appropriate social media posts"
    
    def set_preference(self, machine_name, human_name, default=""):
        s = MeowSetting.objects.get(setting_key=machine_name)
        if s is not None:
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
        self.set_preference("fb_default_photo", "Default facebook icon", "http://dailybruin.com/images/2013/01/dailybruinicon2.jpeg")
        self.set_preference("twitter_character_limit", "Twitter character limit", "117")
        self.set_preference("bitly_access_token", "Bit.ly access token")
        
        
        
