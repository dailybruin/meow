from django.core.management.base import BaseCommand, CommandError
from scheduler.models import MeowSetting
from django.contrib.auth.models import Group, Permission
import os

class Command(BaseCommand):
    help = "Sets default database settings"

    def set_preference(self, machine_name, human_name, default=""):
        if MeowSetting.objects.filter(setting_key=machine_name).count() > 0:
            return
        input_string = human_name
        if default is not "" and default is not None:
            input_string = input_string + " (" + default + ")"
        input_string = input_string + ": "

        user_input = input(input_string)
        if user_input is "":
            user_input = default
        s = MeowSetting(setting_key=machine_name, setting_value=user_input)
        s.save()

    def create_setting_from_value(self, machine_name, value):
        if MeowSetting.objects.filter(setting_key=machine_name).count() > 0:
            return
        s = MeowSetting(setting_key=machine_name, setting_value=value)
        s.save()

    def handle(self, *args, **options):

        settings = [
            ("twitter_consumer_key", "Twitter consumer key"),
            ("twitter_consumer_secret", "Twitter consumer secret"),
            ("fb_app_id", "Facebook app ID"),
            ("fb_app_secret", "Facebook app secret"),
            ("fb_default_photo", "Default facebook icon",
                                "http://dailybruin.com/images/2013/01/dailybruinicon2.jpeg"),
            ("twitter_character_limit","Twitter character limit", "232"),
            ("bitly_access_token", "Bit.ly access token"),
            ("site_url", "Meow URL", "http://meow.dailybruin.com"),
            ("organization_name", "Organization Name", "Daily Bruin Online"),
            ("from_email", "Email (from)", "noreply@dailybruin.com"),
            ("send_posts", "Send posts", "Yes"),
            ("site_message", "Site message (blank)"),
            ("default_image_selector",
                                "Default featured image selector", "img.attachment-db-category-full"),
            ("editor_channel", "Editor Role Channel", "editors-100"),
            ("copy_channel", "Copy Role Channel", "editors-100"),
            ("online_channel", "Online Role Channel", "editors-100")
        ]
        for setting in settings:
            machine_name = setting[0]
            human_name = setting[1]
            default_value = ""
            if len(setting) > 2:
                default_value =  setting[2]
            if machine_name.upper() in os.environ:
                env_value = os.environ[machine_name.upper()]
                if env_value == "DEFAULT":
                    env_value = default_value
                self.create_setting_from_value(machine_name, env_value)
            else:
                self.set_preference(machine_name, human_name, default_value)

        # Configure gruops
        if Group.objects.filter(name='Editors').count() == 0:
            group_editors = Group(name='Editors')
            group_editors.save()
            group_editors.permissions.add(
                Permission.objects.get(codename='add_edit_post'))
            group_editors.save()

        if Group.objects.filter(name='Copy').count() == 0:
            group_copy = Group(name='Copy')
            group_copy.save()
            group_copy.permissions.add(
                Permission.objects.get(codename='add_edit_post'))
            group_copy.permissions.add(
                Permission.objects.get(codename='approve_copy'))
            group_copy.save()

        if Group.objects.filter(name='Online').count() == 0:
            group_online = Group(name='Online')
            group_online.save()
            group_online.permissions.add(
                Permission.objects.get(codename='add_edit_post'))
            group_online.permissions.add(
                Permission.objects.get(codename='approve_copy'))
            group_online.permissions.add(
                Permission.objects.get(codename='approve_online'))
            group_online.save()
