# Generated by Django 2.2.24 on 2022-01-07 23:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0014_post_opensea_link'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='description',
            field=models.CharField(default='No Description', max_length=1000, null=True),
        ),
    ]
