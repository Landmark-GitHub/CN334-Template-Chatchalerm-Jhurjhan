from django.test import TestCase
from user_management.models import Customer
from django.contrib.auth.models import User

class CustomerTestCase(TestCase):
    def setUp(self):
        User.objects.create_user(username="TestII", password="123456789")
    def test_create_customer_true(self):
        """Customer can create correctly"""
        register_data = {"fullname":"Test2", "address":"123/123", "province":"Bangkok",
            "post_code":"10300", "tel":"097895645"
            }
        
        user = User.objects.get(username="TestII")
        customer = Customer(user=user, **register_data)
        customer.save()
        customer_dict = customer.__dict__
        del customer_dict['_state']
        del customer_dict['id']
        del customer_dict['user_id']
        self.assertEqual(customer_dict, register_data)