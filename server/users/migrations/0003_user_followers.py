# Generated by Django 3.2.9 on 2021-11-20 00:40

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_remove_user_venmo_handle'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='followers',
            field=models.ManyToManyField(blank=True, related_name='o_followers', to=settings.AUTH_USER_MODEL),
        ),
    ]
