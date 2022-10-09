from django.contrib import admin
from .models import OrderBookData, MinerData, CurrentProfit, HashOrderData

admin.site.register(MinerData)
admin.site.register(OrderBookData)
admin.site.register(CurrentProfit)
admin.site.register(HashOrderData)



