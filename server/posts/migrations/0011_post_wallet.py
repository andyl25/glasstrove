# Generated by Django 2.2.24 on 2022-01-04 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0010_auto_20211225_0629'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='wallet',
            field=models.CharField(default='0x000000123456', max_length=300),
        ),
    ]