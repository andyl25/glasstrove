from django.db import models
from django.contrib.auth.models import AbstractUser
from posts.models import Post
from django.conf import settings


class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(blank=False, max_length = 255, verbose_name="email")
    following = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='followers', blank=True)
    numfollowers = models.IntegerField(default = 0, blank = False)
    # wallets = models.

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"

