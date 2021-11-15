from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.AutoField(primary_key=True)
    email = models.EmailField(blank=False, max_length = 255, verbose_name="email")    
    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"