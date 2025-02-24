from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile, Stock, Transaction, Portfolio

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        # Tells django to not include the password in user info, only accept it
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['user', 'balance', 'username']

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'ticker', 'name', 'price']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'stock', 'transaction_type', 'quantity', 'price', 'timestamp']
        read_only_fields = ['user', 'timestamp']

class PortfolioSerializer(serializers.ModelSerializer):
    stock_ticker = serializers.CharField(source="stock.ticker", read_only=True)
    stock_name = serializers.CharField(source="stock.name", read_only=True)

    class Meta:
        model = Portfolio
        fields = ['id', 'user', 'stock', 'stock_ticker', 'stock_name', 'quantity', 'purchase_price']
