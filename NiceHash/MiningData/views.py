from django.shortcuts import render
from rest_framework import viewsets
from .serializers import MiningDataSet
from .models import MiningData
from back_end.order_monitor import OrderMonitor


class MiningDataViews(viewsets.ModelViewSet):
    queryset = MiningData.objects.all()
    serializer_class = MiningDataSet
    http_method_names = ['get']


def index(request):

    monitor = OrderMonitor()

    monitor.get_order_book()

    return render(request, 'MiningData/index.html')