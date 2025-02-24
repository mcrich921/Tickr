from django.contrib import admin
from .models import Stock, Transaction, UserProfile, Portfolio

class StockAdmin(admin.ModelAdmin):
    list_display = ('ticker', 'name', 'price')  # Shows these fields in the list view
    search_fields = ('ticker', 'name')  # Allows searching by ticker or name
    ordering = ('ticker',)  # Default ordering by ticker

class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'stock', 'transaction_type', 'quantity', 'price', 'timestamp')
    list_filter = ('transaction_type','stock',)  # Add a filter for transaction type (BUY/SELL)

class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')  # Display user and balance in the list view
    search_fields = ('user__username',)  # Allow searching by username
    ordering = ('user',)  # Default ordering by username

class PortfolioAdmin(admin.ModelAdmin):
    list_display = ('user', 'stock', 'quantity', 'purchase_price')

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Portfolio, PortfolioAdmin)

admin.site.register(Stock, StockAdmin)
admin.site.register(Transaction, TransactionAdmin)
