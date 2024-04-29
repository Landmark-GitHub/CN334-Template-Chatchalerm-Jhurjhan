from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    fullname = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=500, blank=True)
    province = models.CharField(max_length=100, blank=True)
    post_code = models.CharField(max_length=5, blank=True)
    tel = models.CharField(max_length=20, blank=True)
    def __str__(self):
        return f"{self.user.username} - {self.fullname}"

class CartItem(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"ID: {self.id} - {self.customer.fullname } - {self.product_name} - {self.quantity}"

class Order(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    order_day = models.DateField(auto_now_add=True)
    address = models.CharField(max_length=500)  # Assuming address is a string
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('Shipped', 'Shipped'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    tel = models.CharField(max_length=20)  # Assuming tel is a string
    def __str__(self):
        return f"Order ID: {self.id}, Customer: {self.customer.fullname}, Amount: {self.amount}, Status: {self.status}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"Order ID: {self.order.id}, Product: {self.product_name}, Price: {self.price}, Quantity: {self.quantity}"