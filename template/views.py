import requests
from django.shortcuts import render
from django.http import JsonResponse


def home(request):
    response_topcat = requests.get('http://194.5.193.46:8000/api-v1/top_categories/')
    response_hero = requests.get('http://194.5.193.46:8000/api-v1/herogallery/')
    response_catlist = requests.get('http://194.5.193.46:8000/api-v1/categories/')
    response_topproduct=requests.get('http://194.5.193.46:8000/api-v1/top_product/?limit=9')
    response_photo=requests.get('http://194.5.193.46:8000/api-v1/galery/')
    photo=response_photo.json()
    top_category=response_topcat.json()
    hero=response_hero.json()
    categories = response_catlist.json()
    products=response_topproduct.json()
    return render(request, 'index.html',{'category': categories,'top_category':top_category,'top_product':products,
                                          'photos':photo,'hero':hero})


def category_item(request, pk):
    response_catlist = requests.get('http://194.5.193.46:8000/api-v1/categories/')
    response_subcat = requests.get(f'http://194.5.193.46:8000/api-v1/categories/{pk}/')
    response_product=requests.get(f'http://194.5.193.46:8000/api-v1/product_for_cat/{pk}')
    response_photo=requests.get('http://194.5.193.46:8000/api-v1/galery/')
    photo=response_photo.json()
    product = response_product.json()
    categories = response_catlist.json()
    sub_categories = response_subcat.json()

    return render(request, 'category_item.html', {'category': categories, 'sub_categories':sub_categories,'product':product,
                                                   'photos':photo})

def product_detils(request, pk):
    response_catlist = requests.get('http://194.5.193.46:8000/api-v1/categories/')
    response_product=requests.get(f'http://194.5.193.46:8000/api-v1/product_for_cat/{pk}')
    response_photo=requests.get('http://194.5.193.46:8000/api-v1/galery/')
    photo=response_photo.json()
    product = response_product.json()
    categories = response_catlist.json()

    return render(request, 'product_atr.html', {'category': categories,'product':product,
                                                   'photos':photo})