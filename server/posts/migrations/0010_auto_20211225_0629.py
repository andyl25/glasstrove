# Generated by Django 2.2.24 on 2021-12-25 06:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0009_auto_20211225_0544'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='post_asset_contract',
            field=models.CharField(default='1', max_length=600),
        ),
        migrations.AddField(
            model_name='post',
            name='post_token_id',
            field=models.CharField(default='1', max_length=300),
        ),
    ]
