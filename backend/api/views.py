from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Stock, Transaction, UserProfile
from .serializers import UserSerializer, StockSerializer, TransactionSerializer
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response

# User Views
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Stock Views
class StockListView(generics.ListAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]

import yfinance as yf

class StockDetailView(generics.RetrieveAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        ticker = kwargs.get("ticker")

        # Try to get stock in database
        stock = Stock.objects.filter(ticker=ticker).first()

        try:
            ticker_info = yf.Ticker(ticker)
            stock_price = ticker_info.history(period="1d")["Close"].iloc[-1]
            if not stock:
                stock = Stock.objects.create(ticker=ticker, price=stock_price, name=ticker_info.info['longName'])
            else:
                stock.price = stock_price
                stock.save()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response(StockSerializer(stock).data)

# Transaction Views
class BuyStockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        stock_id = request.data.get("stock_id")
        quantity = request.data.get("quantity")

        stock = Stock.objects.get(id=stock_id)
        stock_price = stock.price
        total_price = stock_price * quantity

        # Check if user has enough balance
        user_profile = UserProfile.objects.get(user=user)
        if user_profile.balance < total_price:
            return Response({"message": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create transaction
        transaction = Transaction.objects.create(
            user=user,
            stock=stock,
            transaction_type="BUY",
            quantity=quantity,
            price=stock_price
        )

        user_profile.balance -= total_price
        user_profile.save()

        return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)

class SellStockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        stock_id = request.data.get("stock_id")
        quantity = request.data.get("quantity")

        stock = Stock.objects.get(id=stock_id)
        stock_price = stock.price
        total_price = stock_price * quantity

        user_transactions = Transaction.objects.filter(user=user, stock=stock, transaction_type="BUY")
        total_bought = sum(txn.quantity for txn in user_transactions)
        if total_bought < quantity:
            return Response({"message": "You don't have enough stocks to sell"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create transaction
        transaction = Transaction.objects.create(
            user=user,
            stock=stock,
            transaction_type="SELL",
            quantity=quantity,
            price=stock_price
        )

        user_profile = UserProfile.objects.get(user=user)
        user_profile.balance += total_price
        user_profile.save()

        return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)
    
class UserTransactionsView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)