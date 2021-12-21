import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from graphene_django import DjangoObjectType
from .models import User
from posts.models import Post
from posts.schema import PostType
from wallets.models import Wallet

from graphene_django.forms.converter import convert_form_field
from django_filters.fields import MultipleChoiceField
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required


class WalletType(DjangoObjectType):
    class Meta:
        model = Wallet
        fields = ("owner", "address")

class Query(UserQuery, MeQuery, graphene.ObjectType):
    wallets = graphene.List(WalletType)
    def resolve_wallets(root, info):
        return Wallet.objects.all



schema = graphene.Schema(query = Query)


