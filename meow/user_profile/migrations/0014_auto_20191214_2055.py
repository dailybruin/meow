# Generated by Django 2.2.6 on 2019-12-15 04:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user_profile', '0013_auto_20191122_0839'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='theme',
            options={'ordering': ['pk']},
        ),
    ]