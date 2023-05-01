from rest_framework import serializers
from .models import *


class ProductOne(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class OwnerOne(serializers.ModelSerializer):
    class Meta:
        model = Owner
        fields = "__all__"


class UserOne(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'security', 'id']

