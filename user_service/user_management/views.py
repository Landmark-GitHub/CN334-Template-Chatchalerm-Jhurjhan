from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.contrib.auth.models import User
from .models import Customer, CartItem, Order, OrderItem
from user_management.serializers import CustomerSerializer
from user_management.serializers import CartItemSerializer, OrderSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Count, Sum

def dashboard_view(request):
    # 1. Real-time Order Overview
    total_orders = Order.objects.count()
    total_order_amount = Order.objects.aggregate(total_amount=Sum('amount'))['total_amount']
    average_order_amount = total_order_amount / total_orders if total_orders > 0 else 0
    popular_product = OrderItem.objects.values('product_name').annotate(total_quantity=Sum('quantity')).order_by('-total_quantity').first()
    # 2. Order Status Tracking
    status_counts = Order.objects.values('status').annotate(count=Count('id'))
    # 3. Product Performance
    product_sales = OrderItem.objects.values('product_name').annotate(total_quantity=Sum('quantity')).order_by('-total_quantity')[:5]
    # 4. Geographic Distribution
    order_distribution = Customer.objects.values('province').annotate(total_orders=Count('order__id'))
    # 5. Customer Insights
    customer_count = Customer.objects.count()
    order_frequency = total_orders / customer_count if customer_count > 0 else 0
    # 6. Sales Performance
    daily_sales = Order.objects.values('order_day').annotate(total_sales=Sum('amount'))
    context = {
        'total_orders': total_orders,
        'total_order_amount': total_order_amount,
        'average_order_amount': average_order_amount,
        'popular_product': popular_product,
        'status_counts': status_counts,
        'product_sales': product_sales,
        'order_distribution': order_distribution,
        'customer_count': customer_count,
        'order_frequency': order_frequency,
        'daily_sales': daily_sales,
    }
    return render(request, 'dashboard.html', context)

@csrf_exempt
def editCustomer(request):
    if request.method == "PUT":
        data = JSONParser().parse(request)
        customer_id = data.get('id')
        try:
            customer = Customer.objects.get(id=customer_id)
            for key, value in data.items():
                # Check if the key exists in the Customer model and the value has changed
                if hasattr(customer, key) and getattr(customer, key) != value:
                    setattr(customer, key, value)
            customer.save()
            return JsonResponse({"message": "Customer data updated successfully"}, status=200)
        except Customer.DoesNotExist:
            return JsonResponse({"error": "Customer not found"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Only PUT method is allowed"}, status=405)

@csrf_exempt
def editProductToCart(request):
    if request.method == "PUT":
        data = JSONParser().parse(request)
        try:
            # Extract data from JSON
            product_id = data.get('id')
            new_quantity = data.get('quantity')

            # Check if the product exists
            try:
                cart_item = CartItem.objects.get(id=product_id)
            except CartItem.DoesNotExist:
                return JsonResponse({'error': 'Product not found'}, status=404)

            # Update the quantity of the product
            cart_item.quantity = new_quantity
            cart_item.save()

            # Serialize the updated cart item and return it as JSON response
            serializer = CartItemSerializer(cart_item)
            return JsonResponse(serializer.data, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Only PUT method is allowed'}, status=405)

    
@csrf_exempt
def getOrder(request):
    if request.method == "GET":
        customer_id = request.GET.get('customer', None)
        if customer_id is not None:
            orders = Order.objects.filter(customer=customer_id)
            order_serializer = OrderSerializer(orders, many=True)
            return JsonResponse(order_serializer.data, safe=False, status=200)
        else:
            return JsonResponse({'error': 'Customer ID is missing'}, status=400)
    else:
        return JsonResponse({'error': 'Only GET method is allowed'}, status=405)
    
    
@csrf_exempt
def addOder(request):
    if request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = OrderSerializer(data=data)
        if serializer.is_valid():
            try:
                order = serializer.save()
                order_items_data = data.get('items')
                for item_data in order_items_data:
                    OrderItem.objects.create(
                        order=order,
                        product_name=item_data.get('product_name'),
                        quantity=item_data.get('quantity'),
                        price=item_data.get('price')
                    )
                return JsonResponse(serializer.data, status=201)
            except Exception as e:
                return JsonResponse({'error': str(e)}, status=500)
        return JsonResponse(serializer.errors, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# Create your views here.
class CustomerView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        customer_data = Customer.objects.get(user=request.user)
        customer_serializer = CustomerSerializer(customer_data)
        content = {
        'data': customer_serializer.data
        }
        return Response(content)

@csrf_exempt
def register(request):
    if request.method == "POST":
        data = JSONParser().parse(request)
        try: 
            new_user = User.objects.create_user(username=data['username'], password=data['password'])
        except:
            return JsonResponse({"error":"username already used."}, status=400)
        new_user.save()
        data['user'] = new_user.id
        customer_serializer = CustomerSerializer(data=data)
        if customer_serializer.is_valid():  
            customer_serializer.save()
            return JsonResponse(customer_serializer.data, status=201)
        new_user.delete()
        return JsonResponse({"error":"data not valid"}, status=400)
    return JsonResponse({"error":"method not allowed."}, status=405)

@csrf_exempt
def requestCartItem(request):
    
    if request.method == "GET":
        cart_items = CartItem.objects.all()
        serializer = CartItemSerializer(cart_items, many=True)
        return JsonResponse(serializer.data, safe=False)
    
    if request.method == "POST":
        data = JSONParser().parse(request)
        try:
            customer = Customer.objects.get(user__id=data['customer'])
        except Customer.DoesNotExist:
            return JsonResponse({"message": "Customer not found"}, status=400)

        product_name = data.get('product_name')
        if product_name:
            # Check if a CartItem with the same customer and product_name already exists
            existing_cart_item = CartItem.objects.filter(customer=customer, product_name=product_name).first()
            if existing_cart_item:
                # If exists, increment quantity
                existing_cart_item.quantity += 1
                existing_cart_item.save()
                serializer = CartItemSerializer(existing_cart_item)
                return JsonResponse(serializer.data, status=200)
            else:
                # If not exists, create a new CartItem
                data['customer'] = customer.id
                serializer = CartItemSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(serializer.data, status=201)
                return JsonResponse(serializer.errors, status=400)
        else:
            return JsonResponse({"message": "product_name is required"}, status=400)
    
@csrf_exempt
def deleteCartItem(request):
    try:
        data = json.loads(request.body)
        cart_item = CartItem.objects.get(id=data['id'])
        cart_item.delete()
        return JsonResponse({'message': 'Item deleted successfully'}, status=204)
    except CartItem.DoesNotExist:
        return JsonResponse({'error': 'CartItem not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
@csrf_exempt
def deleteCartItems(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            item_ids = [item_data['id'] for item_data in data]
            deleted_items = CartItem.objects.filter(id__in=item_ids)
            deleted_count = deleted_items.count()
            deleted_items.delete()
            return JsonResponse({'message': f'{deleted_count} items deleted successfully'}, status=204)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

