# Generated by Django 3.2.9 on 2021-11-15 19:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='venmo_handle',
        ),
    ]
