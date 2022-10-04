from rest_framework import serializers

from .models import OrderBookData, MinerData, CurrentProfit


class MiningDataSet(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MinerData
        fields = ('currency_type', 'miner_data')


class OrderBookSet(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = OrderBookData
        fields = ('currency_type', 'order_book_data')


class CurrentProfitSet(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = CurrentProfit
        fields = ('currency_type', 'current_profit', 'current_btc_price')