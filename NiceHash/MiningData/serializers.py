from rest_framework import serializers

from .models import MiningData


class MiningDataSet(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = MiningData
        fields = ('date', 'mining_data')