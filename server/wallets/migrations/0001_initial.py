# Generated by Django 2.2.24 on 2021-12-27 20:59

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Wallet',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('address', models.CharField(blank=True, max_length=255)),
                ('wallet_type', models.CharField(blank=True, max_length=255)),
                ('owner', models.ManyToManyField(blank=True, related_name='wallets', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
