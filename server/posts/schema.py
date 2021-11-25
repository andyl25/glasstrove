import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from graphene_django import DjangoObjectType
from posts.models import Post
from users.models import User


from graphene_django.forms.converter import convert_form_field
from django_filters.fields import MultipleChoiceField
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = ("id", "title", "owner")
        
class Query(graphene.ObjectType):
    post_list = graphene.List(PostType, username=graphene.String())
    def resolve_post_list(root, info, username):
        user_owner = User.objects.get(username = username)
        posts = Post.objects.filter(owner = user_owner)
        return posts


schema = graphene.Schema(query = Query)

