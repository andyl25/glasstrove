# Generated by Django 2.2.24 on 2021-12-25 05:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20211223_2143'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='nonce',
            field=models.IntegerField(default=127926),
        ),
    ]
