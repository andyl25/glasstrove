# Generated by Django 2.2.24 on 2022-01-05 23:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20220104_2007'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='nonce',
            field=models.IntegerField(default=906322),
        ),
    ]
