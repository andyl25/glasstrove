# Generated by Django 2.2.24 on 2022-01-06 23:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20220106_2244'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='nonce',
            field=models.IntegerField(default=371959),
        ),
    ]
