from django.contrib.auth.models import User
from .models import Stock, Transaction, UserProfile, Portfolio
from .serializers import (UserProfileSerializer,
                          UserSerializer,
                          StockSerializer,
                          TransactionSerializer,
                          PortfolioSerializer)
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
        total_price = stock_price * int(quantity)

        # Check if user has enough balance
        user_profile = UserProfile.objects.get(user=user)
        if user_profile.balance < total_price:
            print(total_price)
            return Response({"message": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create transaction
        transaction = Transaction.objects.create(
            user=user,
            stock=stock,
            transaction_type="BUY",
            quantity=quantity,
            price=stock_price
        )

        # Update or create portfolio entry
        portfolio_item, created = Portfolio.objects.get_or_create(user=user, stock=stock, defaults={
            "quantity": quantity,
            "purchase_price": stock_price
        })

        if not created:
            # Update quantity and adjust the average purchase price
            total_shares = portfolio_item.quantity + int(quantity)
            portfolio_item.purchase_price = ((portfolio_item.purchase_price * portfolio_item.quantity) + (stock_price * int(quantity))) / total_shares
            portfolio_item.quantity = total_shares
            portfolio_item.save()

        user_profile.balance -= total_price
        user_profile.save()

        return Response(TransactionSerializer(transaction).data, status=status.HTTP_201_CREATED)

class SellStockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        stock_id = request.data.get("stock_id")
        quantity = int(request.data.get("quantity"))

        stock = Stock.objects.get(id=stock_id)
        stock_price = stock.price
        total_price = stock_price * quantity

        user_portfolio = Portfolio.objects.get(user=user, stock=stock)

        if user_portfolio.quantity < quantity:
            return Response({"message": "You don't have enough stocks to sell"}, status=status.HTTP_400_BAD_REQUEST)
        
        user_portfolio.quantity -= quantity
        if user_portfolio.quantity > 0:
            user_portfolio.save()
        else:
            user_portfolio.delete()
        
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
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_profile = UserProfile.objects.get(user=user)
        return Response(UserProfileSerializer(user_profile).data)

class UserTransactionsView(generics.ListAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
class UserPortfolioView(generics.ListAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Portfolio.objects.filter(user=self.request.user)