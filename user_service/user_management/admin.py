from django.contrib import admin
from user_management.models import Customer
from user_management.models import CartItem
from user_management.models import Order
from user_management.models import OrderItem

# Register your models here.
admin.site.register(Customer)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)