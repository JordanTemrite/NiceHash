from django.db import models


class MiningData(models.Model):

    date = models.IntegerField('date', primary_key=True)
    mining_data = models.JSONField('mining_data')