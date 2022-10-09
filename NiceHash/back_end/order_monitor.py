import uuid
import hmac
import hashlib
from MiningData.models import MinerData, OrderBookData, CurrentProfit, HashOrderData
import requests
from bs4 import BeautifulSoup
import time
import json


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

        url_2 = 'https://solo-etc.2miners.com/api/accounts/0xdbdf66f23305f495b879da36df6fca114d4e501c'
        response_2 = requests.get(url_2)
        self.miner_stats = response_2.json()

        current_block_luck = self.miner_stats['currentLuck']
        try:
            current_balance_due = self.miner_stats['stats']['balance']
            immature_balance = self.miner_stats['stats']['immature']
            last_block_found = self.miner_stats['rewards'][0]['timestamp']
            block_data = self.miner_stats['rewards']

            average_block_luck = 0.00

            for item in block_data:
                average_block_luck += item['currentLuck']

            index = 0
            last_16 = 0.00
            last_32 = 0.00
            for other_data in block_data[0:32]:

                if index < 16:
                    last_16 += other_data['currentLuck']
                    index += 1
                last_32 += other_data['currentLuck']

            average_block_luck = average_block_luck / len(block_data)
            last_16 = last_16 / 16
            last_32 = last_32 / 32
        except:
            current_balance_due = 0
            immature_balance = 0
            last_block_found = 0

        relevant_data = MinerData.objects.filter(pk='ETC')
        relevant_data = relevant_data.first()

        if relevant_data is None:

            new_set = MinerData()
            new_set.currency_type = 'ETC'
            new_set.miner_data = {
                'current_block_luck': current_block_luck,
                'current_balance_due': current_balance_due,
                'immature_balance': immature_balance,
                'last_block_found': last_block_found,
                'block_data': block_data[0:6],
                'average_block_luck': average_block_luck,
                'average_last_16': last_16,
                'average_last_32': last_32
            }

            new_set.save()

        else:

            relevant_data.miner_data = {
                'current_block_luck': current_block_luck,
                'current_balance_due': current_balance_due,
                'immature_balance': immature_balance,
                'last_block_found': last_block_found,
                'block_data': block_data[0:6],
                'average_block_luck': average_block_luck,
                'average_last_16': last_16,
                'average_last_32': last_32
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

        final = resp.json()['result']['XXBTZUSD'][-1][1]
        print(f"FINAL IS {final}")

        relevant_data = CurrentProfit.objects.filter(pk='ETC')
        relevant_data = relevant_data.first()

        calc_data = self.calc_current_rates()

        if relevant_data is None:

            new_set = CurrentProfit()
            new_set.currency_type = 'ETC'
            new_set.current_profit = self.th_profit
            new_set.current_btc_price = final
            new_set.strike_price = calc_data[0]
            new_set.min_profit_price = calc_data[1]

            new_set.save()

        else:

            relevant_data.current_profit = self.th_profit
            relevant_data.current_btc_price = final
            relevant_data.strike_price = calc_data[0]
            relevant_data.min_profit_price = calc_data[1]

            relevant_data.save()

    @staticmethod
    def calc_current_rates():

        current_price_data = CurrentProfit.objects.filter(pk='ETC').first()

        current_btc_price = current_price_data.current_btc_price
        current_profit = current_price_data.current_profit

        current_strike_price = current_profit / current_btc_price

        min_profit_strike = float(current_strike_price) * 0.955

        return [round(current_strike_price, 5), round(min_profit_strike, 5)]

    # Generate a function that will return my orders from the nicehash api
    @staticmethod
    def get_my_orders():

        url_root = 'https://api2.nicehash.com'
        xtime = str(json.loads(requests.get('https://api2.nicehash.com/api/v2/time').text)['serverTime'])
        x_nonce = str(uuid.uuid4())
        x_org_id = '192bb55f-b79a-419f-8fcf-03c57278439a'
        apikey = '28b80d0c-7658-4854-8af6-245c03d7a18f'
        method = 'GET'
        pth = '/main/api/v2/hashpower/myOrders'
        qry = f'algorithm=ETCHASH&ts={1660000000}&op=GT&limit=100'
        s_key = '0172fe41-da9c-4e61-a258-3a2b7ca291fc6b012f85-5532-41ee-ac1e-27bbecff5e2e'
        h_input = '{}\00{}\00{}\00\00{}\00\00{}\00{}\00{}'.format(apikey, xtime, x_nonce, x_org_id, method, pth, qry)
        sig = hmac.new(s_key.encode(), h_input.encode(), hashlib.sha256).hexdigest()
        xauth = '{}:{}'.format(apikey, sig)
        r = requests.get('{}{}?{}'.format(url_root, pth, qry), headers={'X-Time': xtime, 'X-Nonce': x_nonce, 'X-Organization-Id': x_org_id, 'X-Request-Id': x_nonce, 'X-Auth': xauth})
        data = json.loads(r.text)

        for item in data['list']:

            order_id = item['id']
            btc_left = item['availableAmount']
            btc_spent = item['payedAmount']
            estimated_time_at_speed = item['estimateDurationInSeconds']
            market = item['market']
            current_price = item['price']
            current_hash_limit = item['limit']
            alive_status = item['alive']
            current_accepted_speed = item['acceptedCurrentSpeed']
            rig_count = item['rigsCount']

            relevant_data = HashOrderData.objects.filter(pk=order_id).first()

            if relevant_data is None:

                new_set = HashOrderData()
                new_set.order_id = order_id
                new_set.hash_order_data = {
                    'btc_left': btc_left,
                    'btc_spent': btc_spent,
                    'estimated_time_at_speed': estimated_time_at_speed,
                    'market': market,
                    'current_price': current_price,
                    'current_hash_limit': current_hash_limit,
                    'alive_status': alive_status,
                    'current_accepted_speed': current_accepted_speed,
                    'rig_count': rig_count
                }

                new_set.save()

            else:

                relevant_data.hash_order_data = {
                    'btc_left': btc_left,
                    'btc_spent': btc_spent,
                    'estimated_time_at_speed': estimated_time_at_speed,
                    'market': market,
                    'current_price': current_price,
                    'current_hash_limit': current_hash_limit,
                    'alive_status': alive_status,
                    'current_accepted_speed': current_accepted_speed,
                    'rig_count': rig_count
                }

                relevant_data.save()

    def run_loop(self):

        start_time = int(time.time())
        loop_time = 30
        next_loop = 0

        while (int(start_time) + 60) > int(time.time()):

            if next_loop <= int(time.time()):
                print(f"Running Loop {int(time.time())}")

                next_loop = int(time.time()) + int(loop_time)
                self.get_order_book()
                self.get_miner_stats()
                self.get_current_profit()

            else:

                pass