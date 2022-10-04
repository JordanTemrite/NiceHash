from MiningData.models import MinerData, OrderBookData, CurrentProfit
import requests
from bs4 import BeautifulSoup
import time


class OrderMonitor:

    def __init__(self):
        self.order_book = None
        self.miner_stats = None
        self.th_profit = None

    def get_order_book(self):
        url = 'https://api2.nicehash.com/main/api/v2/hashpower/orderBook?algorithm=ETCHASH&size=1000'
        response = requests.get(url)
        self.order_book = response.json()

        eu_total_speed = self.order_book['stats']['EU']['totalSpeed']
        us_total_speed = self.order_book['stats']['USA']['totalSpeed']

        eu_orders = self.order_book['stats']['EU']['orders']
        us_orders = self.order_book['stats']['USA']['orders']

        relevant_data = OrderBookData.objects.filter(pk='ETC')
        relevant_data = relevant_data.first()

        if relevant_data is None:

            new_set = OrderBookData()
            new_set.currency_type = 'ETC'
            new_set.order_book_data = {
                'eu_speed': eu_total_speed,
                'us_speed': us_total_speed,
                'eu_orders': eu_orders,
                'us_orders': us_orders
            }

            new_set.save()
        else:
            relevant_data.order_book_data = {
                'eu_speed': eu_total_speed,
                'us_speed': us_total_speed,
                'eu_orders': eu_orders,
                'us_orders': us_orders
            }

            relevant_data.save()

    def get_miner_stats(self):

        url_2 = 'https://solo-etc.2miners.com/api/accounts/0xdabcA29a4eC112B874D8d96eeD06eA10427e88Bd'
        response_2 = requests.get(url_2)
        self.miner_stats = response_2.json()

        current_block_luck = self.miner_stats['currentLuck']
        current_balance_due = self.miner_stats['stats']['balance']
        immature_balance = self.miner_stats['stats']['immature']
        last_block_found = self.miner_stats['rewards'][0]['timestamp']

        relevant_data = MinerData.objects.filter(pk='ETC')
        relevant_data = relevant_data.first()

        if relevant_data is None:

            new_set = MinerData()
            new_set.currency_type = 'ETC'
            new_set.miner_data = {
                'current_block_luck': current_block_luck,
                'current_balance_due': current_balance_due,
                'immature_balance': immature_balance,
                'last_block_found': last_block_found
            }

            new_set.save()

        else:

            relevant_data.miner_data = {
                'current_block_luck': current_block_luck,
                'current_balance_due': current_balance_due,
                'immature_balance': immature_balance,
                'last_block_found': last_block_found
            }

            relevant_data.save()

    def get_current_profit(self):
        url_3 = 'https://2cryptocalc.com/etc-mining-calculator?hashrate=1000000'
        response_3 = requests.get(url_3)
        html_doc = BeautifulSoup(response_3.text, 'html.parser')
        un_san = html_doc.find_all('div', {'id': 'pool24usd'})

        self.th_profit = float(un_san[0].text.split('>')[0].split('$')[0].replace(" ", ""))

        timestamp = int(time.time()) - 30

        resp = requests.get(f'https://api.kraken.com/0/public/Spread?pair=XBTUSD&since{timestamp}')

        final = [pd for pd in resp.json()['result']['XXBTZUSD'] if pd[0] == timestamp][0][1]

        relevant_data = CurrentProfit.objects.filter(pk='ETC')
        relevant_data = relevant_data.first()

        if relevant_data is None:

            new_set = CurrentProfit()
            new_set.currency_type = 'ETC'
            new_set.current_profit = self.th_profit
            new_set.current_btc_price = final

            new_set.save()

        else:

            relevant_data.current_profit = self.th_profit
            relevant_data.current_btc_price = final

            relevant_data.save()

    @staticmethod
    def calc_current_rates():

        current_price_data = CurrentProfit.objects.filter(pk='ETC').first()

        current_btc_price = current_price_data.current_btc_price
        current_profit = current_price_data.current_profit

        current_strike_price = current_profit / current_btc_price

        min_profit_strike = float(current_strike_price) * 0.955

        print(round(current_strike_price, 5), round(min_profit_strike, 5))