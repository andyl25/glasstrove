from django.urls import path
from graphene_django.views import GraphQLView
from . import views

urlpatterns = [

    path('csrf/', views.csrf),
    
]