from django.shortcuts import render
from django.contrib.auth.models import User
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

class StockDetailView(generics.RetrieveAPIView):
    queryset = Stock.objects.all()
    serializer_class = StockSerializer
    permission_classes = [IsAuthenticated]

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