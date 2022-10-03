from MiningData.models import MiningData
import requests


class OrderMonitor:

    def __init__(self):
        self.order_book = None

    def get_order_book(self):
        url = 'https://api2.nicehash.com/main/api/v2/hashpower/orderBook?algorithm=ETCHASH&size=1000'
        response = requests.get(url)
        self.order_book = response.json()

        print(self.order_book)

