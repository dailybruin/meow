"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase
from rest_framework.test import APIRequestFactory
from scheduler.models import SMPostTag

factory = APIRequestFactory()

class SimpleTest(TestCase):
    def test_basic_addition(self):
        """
        Tests that 1 + 1 always equals 2.
        """
        self.assertEqual(1 + 1, 2)

class SMPostTagTest(TestCase):
    def test_creating_tags(self):
        [x.delete() for x in SMPostTag.objects.all()]
        request = factory.post('tags/create-many', {'tags': ["tag1", "tag2"]})
        # now check that the 2 tags have been created.
        self.assertEqual(SMPostTag.objects.count() == 0)
