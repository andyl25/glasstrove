import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from graphene_django import DjangoObjectType
from posts.models import Post
from users.models import User
# from users.schema import UserType


from graphene_django.forms.converter import convert_form_field
from django_filters.fields import MultipleChoiceField
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = ("id", "title", "owner", "order", "image_url", "x_pos", "y_pos", "size")

class AddPost(graphene.Mutation):
    class Arguments:
        title = graphene.String()
        image_url = graphene.String()
        order = graphene.Int()
        x_pos = graphene.Int()
        y_pos = graphene.Int()
        size = graphene.Int()
    ok = graphene.Boolean()
    post = graphene.Field(PostType)
    def mutate(root, info, title, image_url, order = None, x_pos = None, y_pos = None, size = None):
        if not info.context.user.is_authenticated:
            return AddPost(ok=False, post=None)
        user_instance = info.context.user
        post_instance = Post.objects.create(title = title, image_url = image_url, owner = user_instance,
            order = order, x_pos = x_pos, y_pos = y_pos, size = size)
        post_instance.save()
        return AddPost(ok=True, post=post_instance)

class EditPost(graphene.Mutation):
    class Arguments:
        id = graphene.Int()
        order = graphene.Int()
        x_pos = graphene.Int()
        y_pos = graphene.Int()
        size = graphene.Int()
    ok = graphene.Boolean()
    post = graphene.Field(PostType)
    def mutate(root, info, id, order = None, x_pos = None, y_pos = None, size = None):
        post_instance = Post.objects.get(id = id)
        if not info.context.user.is_authenticated:
            return EditPost(ok=False, post=None)
        if not post_instance in Post.objects.filter(owner = info.context.user):
            return EditPost(ok=False, post=None)
        user_instance = info.context.user
        
        if not order is None:
            post_instance.order = order
        if not x_pos is None:
            post_instance.x_pos = x_pos
        if not y_pos is None:
            post_instance.y_pos = y_pos
        if not size is None:
            post_instance.size = size

        post_instance.save()
        return EditPost(ok=True, post=post_instance)

class deletePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int()
    ok = graphene.Boolean()
    post = graphene.Field(PostType)
    def mutate(root, info, id):
        post_instance = Post.objects.get(id = id)
        if not info.context.user.is_authenticated:
            return deletePost(ok=False)
        if not post_instance in Post.objects.filter(owner = info.context.user):
            return deletePost(ok=False)
        post_instance.delete()
        return deletePost(ok=True)

class Query(graphene.ObjectType):
    post_list = graphene.List(PostType, username=graphene.String())
    specific_post = graphene.List(PostType, id = graphene.Int())
    profile_pic = graphene.List(PostType, username=graphene.String())
    def resolve_profile_pic(root, info, username):
        user_owner = User.objects.get(username = username)
        pp = Post.objects.filter(owner = user_owner)
        return pp.filter(profile_pic=True)
    def resolve_post_list(root, info, username):
        user_owner = User.objects.get(username = username)
        posts = Post.objects.filter(owner = user_owner)
        return posts.filter(profile_pic=False)
    def resolve_specific_post(root, info, id):
        posts = Post.objects.filter(id = id)
        return posts

class Mutation(graphene.ObjectType):
    add_post = AddPost.Field()
    edit_post = EditPost.Field()
    delete_post = deletePost.Field()

schema = graphene.Schema(query = Query, mutation = Mutation)

