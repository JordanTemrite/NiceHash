# Generated by Django 4.1.1 on 2022-10-04 02:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('MiningData', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='CurrentProfit',
            fields=[
                ('currency_type', models.TextField(primary_key=True, serialize=False, verbose_name='currency_type')),
                ('current_profit', models.DecimalField(decimal_places=2, max_digits=50, verbose_name='current_profit')),
            ],
        ),
        migrations.CreateModel(
            name='MinerData',
            fields=[
                ('currency_type', models.TextField(primary_key=True, serialize=False, verbose_name='currency_type')),
                ('miner_data', models.JSONField(verbose_name='Miner Data')),
            ],
        ),
        migrations.CreateModel(
            name='OrderBookData',
            fields=[
                ('currency_type', models.TextField(primary_key=True, serialize=False, verbose_name='currency_type')),
                ('order_book_data', models.JSONField(verbose_name='order_book_data')),
            ],
        ),
        migrations.DeleteModel(
            name='MiningData',
        ),
    ]