# Generated by Django 2.2.24 on 2021-12-25 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_auto_20211225_1900'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='bio',
            field=models.CharField(blank=True, default='', max_length=150),
        ),
        migrations.AlterField(
            model_name='user',
            name='nonce',
            field=models.IntegerField(default=472488),
        ),
    ]
