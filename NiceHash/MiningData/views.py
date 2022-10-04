from django.shortcuts import render
from rest_framework import viewsets
from .serializers import MiningDataSet, OrderBookSet, CurrentProfitSet
from .models import MinerData, OrderBookData, CurrentProfit
from back_end.order_monitor import OrderMonitor


class MiningDataViews(viewsets.ModelViewSet):
    queryset = MinerData.objects.all()
    serializer_class = MiningDataSet
    http_method_names = ['get']


class OrderViews(viewsets.ModelViewSet):
    queryset = OrderBookData.objects.all()
    serializer_class = OrderBookSet
    http_method_names = ['get']


class ProfitViews(viewsets.ModelViewSet):
    queryset = CurrentProfit.objects.all()
    serializer_class = CurrentProfitSet
    http_method_names = ['get']


def index(request):

    return render(request, 'MiningData/index.html')