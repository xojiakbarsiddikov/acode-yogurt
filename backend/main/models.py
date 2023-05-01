from django.db import models
from django.contrib.auth.models import AbstractUser


class Product(models.Model):
    label = models.CharField(max_length=210)
    value = models.CharField(max_length=210)
    price = models.IntegerField()
    count = models.IntegerField()
    message = models.TextField()


class User(AbstractUser):
    security = models.CharField(max_length=120, null=True, blank=True)


class Owner(models.Model):
    name = models.CharField(max_length=210)
    category = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.CharField(max_length=210)
    price = models.IntegerField()
    percent = models.IntegerField()
    count = models.IntegerField()
    given = models.BooleanField(default=False)
    message = models.TextField()

