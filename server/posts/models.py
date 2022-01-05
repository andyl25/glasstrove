from django.conf import settings
from django.db import models

class Post(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=300, null=True, default="")
    description = models.CharField(max_length=1000, null = True, default="")
    external_link =  models.URLField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    order = models.IntegerField(blank=True, null=True)
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts')
    wallet = models.CharField(max_length=300, blank = False, default="0x000000123456")
    posted_date = models.DateTimeField(blank=True, null=True)
    x_pos = models.IntegerField(blank = True, null=True)
    y_pos = models.IntegerField(blank = True, null=True)
    size = models.IntegerField(blank = True, null=True)
    profile_pic = models.BooleanField(blank = False, default=False)
    post_token_id = models.CharField(max_length=300, blank = False, default="1")
    post_asset_contract = models.CharField(max_length=600, blank = False, default="1")
    creator = models.CharField(max_length=600, blank = True, default="No Creator")