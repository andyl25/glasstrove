from django.db import models
from users.models import User
from posts.models import Post
from django.conf import settings
# Create your models here.
class Wallet(models.Model):
    id = models.AutoField(primary_key=True)
    address = models.CharField(max_length=255, blank = True)
    wallet_type = models.CharField(max_length=255, blank = True)
    owner = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='wallets', blank=True)