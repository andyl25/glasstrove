# Generated by Django 2.2.24 on 2022-01-08 00:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0016_auto_20220108_0000'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='creator',
            field=models.CharField(blank=True, default='No Creator', max_length=600),
        ),
    ]