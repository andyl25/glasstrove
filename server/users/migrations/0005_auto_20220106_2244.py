# Generated by Django 2.2.24 on 2022-01-06 22:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_auto_20220105_2316'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='nonce',
            field=models.IntegerField(default=889782),
        ),
    ]
