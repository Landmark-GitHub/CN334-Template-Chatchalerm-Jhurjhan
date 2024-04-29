from rest_framework import serializers
from user_management.models import Customer
from user_management.models import CartItem
from user_management.models import Order
from user_management.models import OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'customer', 'order_day', 'address', 'amount', 'status', 'tel', 'items']


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['id', 'user', 'fullname', 'address', 'province', 'post_code', 'tel']
        
class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = ['id','customer', 'product_name', 'quantity', 'price'] 
        