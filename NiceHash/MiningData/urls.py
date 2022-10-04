from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()

router.register(r'mining_data', views.MiningDataViews)
router.register(r'order_book', views.OrderViews)
router.register(r'current_profit', views.ProfitViews)


app_name = 'MiningData'

urlpatterns = [
    path('', views.index, name='index'),
    path('api/', include(router.urls), name='api'),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]