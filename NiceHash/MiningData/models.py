from django.db import models


class OrderBookData(models.Model):

    currency_type = models.TextField('currency_type', primary_key=True)
    order_book_data = models.JSONField('order_book_data')


class MinerData(models.Model):

    currency_type = models.TextField('currency_type', primary_key=True)
    miner_data = models.JSONField('Miner Data')


class CurrentProfit(models.Model):

    currency_type = models.TextField('currency_type', primary_key=True)
    current_profit = models.DecimalField('current_profit', max_digits=50, decimal_places=2)
    current_btc_price = models.DecimalField('current_btc_price', max_digits=50, decimal_places=2)
    strike_price = models.DecimalField('strike_price', max_digits=50, decimal_places=4)
    min_profit_price = models.DecimalField('min_profit_price', max_digits=50, decimal_places=4)

