# Generated by Django 3.2.9 on 2021-12-19 17:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0004_auto_20211219_1645'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='profile_pic',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]
