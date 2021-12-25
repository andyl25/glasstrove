import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from graphene_django import DjangoObjectType
from posts.models import Post
from users.models import User
# from users.schema import UserType
import json
import requests


from graphene_django.forms.converter import convert_form_field
from django_filters.fields import MultipleChoiceField
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = ("id", "title", "owner", "order", "image_url", "x_pos", "y_pos", "size", "description", "external_link", "post_token_id", "post_asset_contract")

# class AddPost(graphene.Mutation):
#     class Arguments:
#         title = graphene.String()
#         image_url = graphene.String()
#         order = graphene.Int()
#         x_pos = graphene.Int()
#         y_pos = graphene.Int()
#         size = graphene.Int()
#     ok = graphene.Boolean()
#     post = graphene.Field(PostType)
#     def mutate(root, info, title, image_url, order = 1, x_pos = None, y_pos = None, size = None):
#         if not info.context.user.is_authenticated:
#             return AddPost(ok=False, post=None)
#         user_instance = info.context.user
#         for post_temp in user_instance.posts.all():
#             if not post_temp.order is None:
#                 post_temp.order = post_temp.order + 1
#                 post_temp.save()
#         post_instance = Post.objects.create(title = title, image_url = image_url, owner = user_instance,
#             order = order, x_pos = x_pos, y_pos = y_pos, size = size)
#         post_instance.save()
        
#         return AddPost(ok=True, post=post_instance)

class AddPosts(graphene.Mutation):
    class Arguments:
        contract_address = graphene.List(graphene.String)
        token_id = graphene.List(graphene.String)
    ok = graphene.Boolean()
    err = graphene.String()
    def mutate(root, info, contract_address, token_id):
        
        user_instance = info.context.user
        if user_instance is None:
            return AddPosts(ok = False, err = "not authenticated")
        for wallet in user_instance.wallets.all():
            api_address = wallet.address
            uri = "https://api.opensea.io/api/v1/assets?owner={}".format(api_address)
            
            
            if(len(token_id) >= 30):
                base_url = uri
                for i in range(int(len(token_id)/30)+1):
                    uri = base_url
                    count = i*30
                    while count < (i+1)*30:
                        if(count >= len(token_id)):
                            break
                        uri += "&token_ids={}".format(token_id[count])
                        count += 1
                    
                    count = i*30
                    while count < (i+1)*30:
                        if(count >= len(token_id)):
                            break
                        uri += "&asset_contract_addresses={}".format(contract_address[count])
                        count += 1

                    uri += "&offset={}&limit=30".format(i*30)
                    response = requests.request("GET", uri)
                    # if response.json()["assets"] is None:
                    #     continue
                    for i in ((response.json()["assets"])):
                        test_post = Post.objects.filter(post_token_id = i["token_id"]).filter(post_asset_contract = i["asset_contract"]["address"])
                        if(test_post.count() == 0):
                            if not Post.objects.all():
                                new_post = Post(image_url = i["image_url"], title = i["name"], description = i["description"], 
                                    external_link = i["external_link"], owner = info.context.user, post_token_id = i["token_id"], 
                                    post_asset_contract = i["asset_contract"]["address"], order = 1)
                                new_post.save()
                            else:
                                new_post = Post(image_url = i["image_url"], title = i["name"], description = i["description"], 
                                    external_link = i["external_link"], owner = info.context.user, post_token_id = i["token_id"], 
                                    post_asset_contract = i["asset_contract"]["address"], order = Post.objects.all().order_by('order')[:1][0].order + 1)
                                new_post.save()
                        # print(i)
            else:
                for temp_id in token_id:
                    uri += "&token_ids={}".format(temp_id)
                for temp_address in contract_address:
                    uri += "&asset_contract_addresses={}".format(temp_address)
                uri += "&offset=0&limit=30"
                response = requests.request("GET", uri)
                # print(uri)
                for i in ((response.json()["assets"])):
                    test_post = Post.objects.filter(post_token_id = i["token_id"]).filter(post_asset_contract = i["asset_contract"]["address"])
                    if(test_post.count() == 0):
                        if not Post.objects.all():
                            new_post = Post(image_url = i["image_url"], title = i["name"], description = i["description"], 
                                external_link = i["external_link"], owner = info.context.user, post_token_id = i["token_id"], 
                                post_asset_contract = i["asset_contract"]["address"], order = 1)
                            new_post.save()
                        else:
                            new_post = Post(image_url = i["image_url"], title = i["name"], description = i["description"], 
                                external_link = i["external_link"], owner = info.context.user, post_token_id = i["token_id"], 
                                post_asset_contract = i["asset_contract"]["address"], order = Post.objects.all().order_by('order')[:1][0].order + 1)
                            new_post.save()
                    # print(i)

        return AddPosts(ok = True)

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

class ReorderPosts(graphene.Mutation):
    class Arguments:
        ids = graphene.List(graphene.Int)
    ok = graphene.Boolean()
    posts = graphene.List(PostType)
    err = graphene.String()
    def mutate(root, info, ids):
        if not info.context.user.is_authenticated:
            return ReorderPosts(ok=False, posts = None)
        posts = Post.objects.filter(owner = info.context.user).filter(profile_pic = False)
        user_instance = info.context.user
        count = 1
        for i in ids:
            post_reorder = posts.get(id=i)
            if post_reorder is None:
                return ReorderPosts(ok=False, posts = None)
            if (post_reorder.owner != user_instance):
                return ReorderPosts(ok = False, posts = None, err = "post not owned")
        for i in ids:
             post_reorder = posts.get(id=i)
             post_reorder.order = count
             post_reorder.save()
             count += 1
        return ReorderPosts(ok=True, posts = posts)



class deletePost(graphene.Mutation):
    class Arguments:
        id = graphene.Int()
    ok = graphene.Boolean()
    
    post = graphene.Field(PostType)
    def mutate(root, info, id):
        user_instance = info.context.user
        post_instance = Post.objects.get(id = id)
        if not info.context.user.is_authenticated:
            return deletePost(ok=False)
        if not post_instance in Post.objects.filter(owner = info.context.user):
            return deletePost(ok=False)
        if not post_instance.order is None:
            for post_temp in user_instance.posts.all():
                if not post_temp.order is None and not post_temp.order < post_instance.order:
                    post_temp.order = post_temp.order - 1
                    post_temp.save()
        post_instance.delete()
        return deletePost(ok=True)

class Query(graphene.ObjectType):
    post_list = graphene.List(PostType, username=graphene.String(), numresults = graphene.Int())
    specific_post = graphene.List(PostType, id = graphene.Int())
    profile_pic = graphene.List(PostType, username=graphene.String())
    def resolve_profile_pic(root, info, username):
        user_owner = User.objects.get(username = username)
        pp = Post.objects.filter(owner = user_owner)
        return pp.filter(profile_pic=True)
    def resolve_post_list(root, info, username, numresults=None):
        user_owner = User.objects.get(username = username)
        posts = Post.objects.filter(owner = user_owner)
        if(numresults == None):
            return posts.filter(profile_pic=False).order_by('order')
        return posts.filter(profile_pic=False).order_by('order')[:numresults]
    def resolve_specific_post(root, info, id):
        posts = Post.objects.filter(id = id)
        return posts

class Mutation(graphene.ObjectType):
    add_posts = AddPosts.Field()
    edit_post = EditPost.Field()
    delete_post = deletePost.Field()
    reorder_posts = ReorderPosts.Field()

schema = graphene.Schema(query = Query, mutation = Mutation)
