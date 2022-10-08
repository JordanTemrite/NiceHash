from django.shortcuts import render
from rest_framework import viewsets
from .serializers import MiningDataSet, OrderBookSet, CurrentProfitSet, HashOrderSet
from .models import MinerData, OrderBookData, CurrentProfit, HashOrderData
from back_end.order_monitor import OrderMonitor


class HashOrderViews(viewsets.ModelViewSet):
    queryset = HashOrderData.objects.all()
    serializer_class = HashOrderSet
    http_method_names = ['get']


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

    order_monitor = OrderMonitor()
    order_monitor.get_my_orders()

    return render(request, 'MiningData/index.html')