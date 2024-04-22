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

