# Generated by Django 2.2.24 on 2022-01-07 23:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0013_auto_20220105_2316'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='opensea_link',
            field=models.URLField(blank=True, null=True),
        ),
    ]