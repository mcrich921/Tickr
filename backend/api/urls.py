from django.urls import path
from .views import  (StockListView,
                    StockDetailView,
                    BuyStockView,
                    SellStockView,
                    UserTransactionsView)

urlpatterns = [
    # Stock Views
    path("stocks/", StockListView.as_view(), name="stocks"),
    path("stocks/<str:ticker>/", StockDetailView.as_view(), name="stock"),
    # Transaction Views
    path("buy/", BuyStockView.as_view(), name="buy"),
    path("sell/", SellStockView.as_view(), name="sell"),
    path("transactions/", UserTransactionsView.as_view(), name="transactions"),
]
