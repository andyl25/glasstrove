# Generated by Django 2.2.24 on 2022-01-04 20:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='nonce',
            field=models.IntegerField(default=717117),
        ),
    ]