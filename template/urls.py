from django.urls import path
from . import views
from .views import category_item,product_detils

urlpatterns = [
    path('', views.home, name='home'),
    # path('categories',category_item, name='category_item')
    
]