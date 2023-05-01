from django.urls import path
from .views import *

urlpatterns = [
    path('login/', login_view),
    path('logout/', logout_view),
    path('register/', register),
    path('product/', create_product),
    path('get/product/', get_product),
    path('product/<int:pk>/', get_info),
    path('edit/product/<int:pk>/', update_product),
    path('delete/product/<int:pk>/', delete_product),
    path('owner/', create_owner),
    path('get/owner/', get_owner),
    path('owner/<int:pk>/', get_owner_info),
    path('edit/owner/<int:pk>/', update_owner),
    path('delete/owner/<int:pk>/', delete_owner),
    path('done/deal/', get_given),
    path('user/', create_user),
    path('get/user/', get_user),
    path('user/<int:pk>/', get_single_user),
    path('user/<str:pk>/', get_single_user),
    path('edit/user/', update_user),
]

