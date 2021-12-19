from django.conf import settings
from django.db import models

class Post(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=300, default="no title")
    image_url = models.URLField(blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    posted_date = models.DateTimeField(blank=True, null=True)
    x_pos = models.IntegerField(blank = True, null=True)
    y_pos = models.IntegerField(blank = True, null=True)
    size = models.IntegerField(blank = True, null=True)
    profile_pic = models.BooleanField(blank = False, default=False)