from django.contrib.auth import authenticate, logout
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .serializer import *


@api_view(['POST'])
def login_view(request):
    try:
        username = request.data['username']
        password = request.data['password']
        try:
            usr = User.objects.get(username=username)
            user = authenticate(username=username, password=password)
            if user is not None:
                data = {
                    "username": username,
                    "user_id": usr.id,
                }
                return Response(data, status.HTTP_200_OK)
            else:
                message = 'Username or Password is wrong!'
                data = {
                    'message': message,
                }
                return Response(data, status.HTTP_403_FORBIDDEN)
        except User.DoesNotExist:
            message = {
                'message': 'This User Doesnt Exist'
            }
            return Response(message, status.HTTP_404_NOT_FOUND)
    except Exception as err:
        return Response({"error": f'{err}'})


@api_view(['POST'])
def register(request):
    try:
        if request.method == 'POST':
            username = request.POST['username']
            password = request.POST['password']
            if len(password) >= 6:
                usr = User.objects.create_user(username=username, password=password, security=password)
                data = {
                    "user_id": usr.id,
                    "username": username,
                    "password": password,
                    }
                return Response(data, status.HTTP_200_OK)
            else:
                return Response('Password have to consist of 6 letter', status.HTTP_401_UNAUTHORIZED)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response({"error": f'{err}'})


@api_view(['DELETE'])
@permission_classes(BasicAuthentication)
@authentication_classes(IsAuthenticated)
def logout_view(request):
    try:
        if request.method == 'DELETE':
            user = request.user
            logout(request, user)
            return Response('You logged out')
    except Exception as err:
        return Response(f'error: {err}')


@api_view(['POST'])
def create_product(request):
    try:
        if request.method == 'POST':
            label = request.POST.get('label')
            value = request.POST.get('value')
            price = request.POST.get('price')
            count = request.POST.get('count')
            message = request.POST.get('message')
            product = Product.objects.create(label=label, value=value, price=price, count=count, message=message)
            return Response(ProductOne(product).data)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['GET'])
def get_product(request):
    try:
        if request.method == 'GET':
            product = Product.objects.all()
            return Response(ProductOne(product, many=True).data)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['GET'])
def get_info(request, pk):
    try:
        if request.method == 'GET':
            product = Product.objects.get(id=pk)
            return Response(ProductOne(product).data)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['PATCH'])
def update_product(request, pk):
    try:
        if request.method == 'PATCH':
            product = Product.objects.get(id=pk)
            label = request.POST.get('label')
            value = request.POST.get('value')
            price = request.POST.get('price')
            count = request.POST.get('count')
            message = request.POST.get('message')
            if label:
                product.label = label
            if value:
                product.value = value
            if price:
                product.price = price
            if message:
                product.message = message
            if count:
                product.count = count
            product.save()
            return Response(ProductOne(product).data)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['DELETE'])
def delete_product(request, pk):
    try:
        if request.method == 'DELETE':
            product = Product.objects.get(id=pk)
            product.delete()
            return Response(f'you successfully deleted Product', status.HTTP_202_ACCEPTED)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['POST'])
def create_owner(request):
    try:
        if request.method == 'POST':
            name = request.POST.get('name')
            category = request.POST.get('category')
            date = request.POST.get('date')
            price = request.POST.get('price')
            percent = request.POST.get('percent')
            count = request.POST.get('count')
            message = request.POST.get('message')
            owner = Owner.objects.create(name=name, category_id=category, date=date, percent=percent, count=count,
                                         price=price,message=message)
            return Response(OwnerOne(owner).data)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['GET'])
def get_owner(request):
    try:
        if request.method == 'GET':
            owner = Owner.objects.filter(given=False)
            lg = []
            if owner.count() > 0:
                for i in owner:
                    product = Product.objects.get(id=i.category_id)
                    data = {
                        'id': i.id,
                        'name': i.name,
                        'category': ProductOne(product).data,
                        'count': i.count,
                        'percent': i.percent,
                        'price': i.price,
                        'message': i.message,
                        'date': i.date
                    }
                    lg.append(data)
            return Response(lg)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['GET'])
def get_owner_info(request, pk):
    try:
        if request.method == 'GET':
            owner = Owner.objects.get(id=pk)
            return Response(OwnerOne(owner).data)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['PATCH'])
def update_owner(request, pk):
    try:
        if request.method == 'PATCH':
            owner = Owner.objects.get(id=pk)
            name = request.POST.get('name')
            category = request.POST.get('category')
            date = request.POST.get('date')
            message = request.POST.get('message')
            price = request.POST.get('price')
            count = request.POST.get('count')
            percent = request.POST.get('percent')
            if name:
                owner.name = name
            if price:
                owner.price = price
            if date:
                owner.date = date
            if category:
                owner.category_id = category
            if percent:
                owner.percent = percent
            if count:
                owner.count = count
            if message:
                owner.message = message
            owner.save()
            return Response(OwnerOne(owner).data)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['POST'])
def delete_owner(request, pk):
    try:
        if request.method == 'POST':
            owner = Owner.objects.get(id=pk)
            owner.given = True
            owner.save()
            return Response('you successfully deleted Owner', status.HTTP_202_ACCEPTED)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['GET'])
def get_given(request):
    try:
        if request.method == 'GET':
            given = Owner.objects.filter(given=True)
            tr = []
            if given.count() > 0:
                for i in given:
                    product = Product.objects.get(id=i.category_id)
                    data = {
                        'id': i.id,
                        'name': i.name,
                        'category': ProductOne(product).data,
                        'count': i.count,
                        'percent': i.percent,
                        'price': i.price,
                        'message': i.message,
                        'date': i.date
                    }
                    tr.append(data)
            return Response(tr)
        else:
            return Response('wrong method', status.HTTP_405_METHOD_NOT_ALLOWED)
    except Exception as err:
        return Response(f'error is {err}', status.HTTP_417_EXPECTATION_FAILED)


@api_view(['POST'])
def create_user(request):
    try:
        if request.method == 'POST':
            username = request.POST.get('username')
            password = request.POST.get('password')
            user = User.objects.create_user(username=username, password=password, security=password)
            data = {
                "name": username,
                "password": password,
                "id": user.id,
            }
            return Response(data)
        return Response('wrong method')
    except Exception as err:
        return Response(f'error is {err}')


@api_view(['GET'])
def get_user(request):
    try:
        if request.method == 'GET':
            user = User.objects.all()
            return Response(UserOne(user, many=True).data)
        return Response('wrong method')
    except Exception as err:
        return Response(f'error is {err}')


@api_view(['GET'])
def get_single_user(request, pk):
    try:
        if request.method == 'GET':
            if type(pk) == int:
                user = User.objects.get(id=pk)
            elif type(pk) == str:
                user = User.objects.get(username__contains=pk)
            return Response(UserOne(user).data)
        return Response('wrong method')
    except Exception as err:
        return Response(f'error is {err}')


@api_view(['PATCH'])
def update_user(request):
    try:
        if request.method == 'PATCH':
            user = request.user
            username = request.POST.get('username')
            password = request.POST.get('password')
            user.username = username
            if password == user.security:
                user.set_password(password)
                user.security = password
            user.save()
            return Response(UserOne(user).data)
        return Response('wrong method het')
    except Exception as err:
        return Response(f'error is {err}')


class UserImage(viewsets.ModelViewSet):
    serializer_class = ProductOne
    queryset = Product.objects.all()
