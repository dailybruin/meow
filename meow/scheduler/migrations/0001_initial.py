# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'SMPost'
        db.create_table(u'scheduler_smpost', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('slug', self.gf('django.db.models.fields.CharField')(max_length=100, null=True)),
            ('pub_date', self.gf('django.db.models.fields.DateField')(null=True, blank=True)),
            ('pub_time', self.gf('django.db.models.fields.TimeField')(null=True, blank=True)),
            ('story_url', self.gf('django.db.models.fields.URLField')(max_length=500, null=True, blank=True)),
            ('post_twitter', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('post_facebook', self.gf('django.db.models.fields.TextField')(null=True, blank=True)),
            ('section', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['scheduler.Section'], blank=True)),
            ('pub_ready_copy', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('pub_ready_online', self.gf('django.db.models.fields.BooleanField')(default=False)),
            ('sent', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'scheduler', ['SMPost'])

        # Adding model 'Section'
        db.create_table(u'scheduler_section', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('name', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('twitter_account_handle', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('facebook_account_handle', self.gf('django.db.models.fields.CharField')(max_length=100, null=True, blank=True)),
            ('also_post_to', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['scheduler.Section'], null=True, blank=True)),
            ('twitter_access_key', self.gf('django.db.models.fields.CharField')(max_length=500, null=True, blank=True)),
            ('twitter_access_secret', self.gf('django.db.models.fields.CharField')(max_length=500, null=True, blank=True)),
            ('facebook_key', self.gf('django.db.models.fields.CharField')(max_length=500, null=True, blank=True)),
            ('facebook_page_id', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
        ))
        db.send_create_signal(u'scheduler', ['Section'])

        # Adding model 'MeowSetting'
        db.create_table(u'scheduler_meowsetting', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('setting_key', self.gf('django.db.models.fields.CharField')(unique=True, max_length=100)),
            ('setting_value', self.gf('django.db.models.fields.CharField')(max_length=500)),
        ))
        db.send_create_signal(u'scheduler', ['MeowSetting'])


    def backwards(self, orm):
        # Deleting model 'SMPost'
        db.delete_table(u'scheduler_smpost')

        # Deleting model 'Section'
        db.delete_table(u'scheduler_section')

        # Deleting model 'MeowSetting'
        db.delete_table(u'scheduler_meowsetting')


    models = {
        u'scheduler.meowsetting': {
            'Meta': {'object_name': 'MeowSetting'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'setting_key': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'}),
            'setting_value': ('django.db.models.fields.CharField', [], {'max_length': '500'})
        },
        u'scheduler.section': {
            'Meta': {'object_name': 'Section'},
            'also_post_to': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['scheduler.Section']", 'null': 'True', 'blank': 'True'}),
            'facebook_account_handle': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'facebook_key': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'facebook_page_id': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'twitter_access_key': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'twitter_access_secret': ('django.db.models.fields.CharField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'}),
            'twitter_account_handle': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'})
        },
        u'scheduler.smpost': {
            'Meta': {'object_name': 'SMPost'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'post_facebook': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'post_twitter': ('django.db.models.fields.TextField', [], {'null': 'True', 'blank': 'True'}),
            'pub_date': ('django.db.models.fields.DateField', [], {'null': 'True', 'blank': 'True'}),
            'pub_ready_copy': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'pub_ready_online': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'pub_time': ('django.db.models.fields.TimeField', [], {'null': 'True', 'blank': 'True'}),
            'section': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['scheduler.Section']", 'blank': 'True'}),
            'sent': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'slug': ('django.db.models.fields.CharField', [], {'max_length': '100', 'null': 'True'}),
            'story_url': ('django.db.models.fields.URLField', [], {'max_length': '500', 'null': 'True', 'blank': 'True'})
        }
    }

    complete_apps = ['scheduler']