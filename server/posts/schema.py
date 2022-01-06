import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from graphene_django import DjangoObjectType
from posts.models import Post
from users.models import User
# from users.schema import UserType
import json
import requests
import datetime
from django.db.models import Q



from graphene_django.forms.converter import convert_form_field
from django_filters.fields import MultipleChoiceField
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

class PostType(DjangoObjectType):
    class Meta:
        model = Post
        fields = ("id", "title", "owner", "order", "image_url", "x_pos", "y_pos", "size", "description", 
            "external_link", "post_token_id", "post_asset_contract", "posted_date", "wallet", "creator")

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
                    response = requests.request("GET", uri, headers={"X-API-KEY": "5926963383cb434fb2bd228e4bc4e107"})
                    # if response.json()["assets"] is None:
                    #     continue
                    for i in ((response.json()["assets"])):
                        test_post = Post.objects.filter(owner=user_instance).filter(post_token_id = i["token_id"]).filter(post_asset_contract = i["asset_contract"]["address"])
                        if(i["creator"]["user"]["username"] is None):
                            i["creator"]["user"]["username"] = "No Description"
                        if(test_post.count() == 0):
                            if not Post.objects.filter(owner=user_instance).all():
                                new_post = Post(image_url = i["image_url"], title = i["name"], description = i["description"], 
                                    external_link = i["external_link"], owner = info.context.user, post_token_id = i["token_id"], 
                                    post_asset_contract = i["asset_contract"]["address"], order = 1, posted_date = datetime.datetime.now(), wallet=api_address, creator = i["creator"]["user"]["username"])
                                new_post.save()
                            else:
                                new_post = Post(image_url = i["image_url"], title = i["name"], description = i["description"], 
                                    external_link = i["external_link"], owner = info.context.user, post_token_id = i["token_id"], 
                                    post_asset_contract = i["asset_contract"]["address"], order = Post.objects.filter(owner=user_instance).all().order_by('-order')[:1][0].order + 1, 
                                    posted_date = datetime.datetime.now(), wallet=api_address, creator = i["creator"]["user"]["username"])
                                new_post.save()
                        # print(i)
            else:
                for temp_id in token_id:
                    uri += "&token_ids={}".format(temp_id)
                for temp_address in contract_address:
                    uri += "&asset_contract_addresses={}".format(temp_address)
                uri += "&offset=0&limit=30"
                response = requests.request("GET", uri, headers={"X-API-KEY": "5926963383cb434fb2bd228e4bc4e107"})
                # print(uri)
                for i in ((response.json()["assets"])):
                    test_post = Post.objects.filter(owner=user_instance).filter(post_token_id = i["token_id"]).filter(post_asset_contract = i["asset_contract"]["address"])
                    if(i["creator"]["user"]["username"] is None):
                            i["creator"]["user"]["username"] = "No Description"
                    if(test_post.count() == 0):
                        if not Post.objects.filter(owner=user_instance).all():
                            new_post = Post(image_url = i["image_url"], title = i["name"], description = i["description"], 
                                external_link = i["external_link"], owner = info.context.user, post_token_id = i["token_id"], 
                                post_asset_contract = i["asset_contract"]["address"], order = 1, posted_date = datetime.datetime.now(), wallet=api_address, creator = i["creator"]["user"]["username"])
                            new_post.save()
                        else:
                            new_post = Post(image_url = i["image_url"], title = i["name"], description = i["description"], 
                                external_link = i["external_link"], owner = info.context.user, post_token_id = i["token_id"], 
                                post_asset_contract = i["asset_contract"]["address"], order = Post.objects.filter(owner=user_instance).all().order_by('-order')[:1][0].order + 1, posted_date = datetime.datetime.now(), wallet=api_address, creator = i["creator"]["user"]["username"])
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

class deleteAll(graphene.Mutation):
    ok = graphene.Boolean()
    
    def mutate(root, info):
        Post.objects.all().delete()
        return deleteAll(ok=True)

class deletePost(graphene.Mutation):
    class Arguments:
        id = graphene.List(graphene.Int)
    ok = graphene.Boolean()
    
    post = graphene.Field(PostType)
    def mutate(root, info, id):
        user_instance = info.context.user
        
        if not info.context.user.is_authenticated:
            return deletePost(ok=False)
        post_instances = Post.objects.filter(owner=user_instance).filter(id__in = id)

        post_instances.all().delete()
        return deletePost(ok=True)

class Query(graphene.ObjectType):
    post_list = graphene.List(PostType, username=graphene.String(), offset = graphene.Int(),numresults = graphene.Int())
    specific_post = graphene.List(PostType, id = graphene.Int())
    profile_pic = graphene.List(PostType, username=graphene.String())
    feed = graphene.List(PostType, numresults=graphene.Int())

    def resolve_profile_pic(root, info, username):
        user_owner = User.objects.get(username = username)
        pp = Post.objects.filter(owner = user_owner)
        return pp.filter(profile_pic=True)
    
    def resolve_post_list(root, info, username, offset = 0, numresults=15):
        user_owner = User.objects.get(username = username)
        posts = Post.objects.filter(owner = user_owner).order_by('order')[:numresults]
        # num_wallets = user_owner.wallets.count()
        if(posts.count()-15<0):
            posts_to_check = posts
        else:
            posts_to_check = posts[posts.count()-15:]
        for wallet in user_owner.wallets.all():
            address = wallet.address
            posts_with_wallet = [p for p in posts_to_check if p.wallet==address]

            # posts_with_wallet = posts.filter(wallet = address)
            if(len(posts_with_wallet) == 0):
                continue
            
            uri = "https://api.opensea.io/api/v1/assets?owner={}".format(address)
            # temp_post_arr = []
            for post_check in posts_to_check:
                if (post_check.wallet==address):
                    # temp_post_arr.append(post_check)
                    uri += "&asset_contract_addresses={}".format(post_check.post_asset_contract)
                    uri += "&token_ids={}".format(post_check.post_token_id)
            uri += "&offset=0&limit=30"
            
            response = requests.request("GET", uri, headers={"X-API-KEY": "5926963383cb434fb2bd228e4bc4e107"})
            
            for individual_post in posts_with_wallet:
                check = False
                for response_post in (response.json()["assets"]):
                    if(individual_post.post_token_id == response_post["token_id"] and
                        individual_post.post_asset_contract == response_post["asset_contract"]["address"]):
                        check = True
                if(check == False):
                    individual_post.delete()
        
        # uri = "https://api.opensea.io/api/v1/assets?"
        # for post_check in posts.all():
        #     uri += "&asset_contract_addresses={}".format(post_check.post_asset_contract)
        #     uri += "&token_ids={}".format(post_check.post_token_id)
        # uri += "&offset=0&limit=30"
        # response = requests.request("GET", uri)
        # print(uri)
        # for individual_post in posts.all():
        #     check = False
        #     for response_post in (response.json()["assets"]):
        #         if(individual_post.post_token_id == response_post["token_id"] and
        #             individual_post.post_asset_contract == response_post["asset_contract"]["address"] and
        #             individual_post.wallet == response_post["owner"]["address"]):
        #             check = True
        #             break
        #     if(check == False):
        #         individual_post.delete()
        for i in posts:
            if i is None:
                i.delete()
        
        return posts
    
    def resolve_specific_post(root, info, id):
        posts = Post.objects.filter(id = id)
        address = posts[0].wallet
        uri = "https://api.opensea.io/api/v1/assets?owner={}".format(address)
        uri += "&asset_contract_addresses={}".format(posts[0].post_asset_contract)
        uri += "&token_ids={}".format(posts[0].post_token_id)
        uri += "&offset=0&limit=30"
        response = requests.request("GET", uri, headers={"X-API-KEY": "5926963383cb434fb2bd228e4bc4e107"})
        if(response.json()["assets"][0]["token_id"] == posts[0].post_token_id and response.json()["assets"][0]["asset_contract"]["address"] == posts[0].post_asset_contract):
            return posts
        else:
            posts.all().delete()
            return None
    
    def resolve_feed(root, info, numresults=None):
        query = Q()
        for person in info.context.user.following.all():
            query.add(Q(owner=person), Q.OR)
        posts = Post.objects.filter(query).order_by("-posted_date")[:numresults]
        return posts

class Mutation(graphene.ObjectType):
    add_posts = AddPosts.Field()
    edit_post = EditPost.Field()
    delete_post = deletePost.Field()
    reorder_posts = ReorderPosts.Field()
    delete_all = deleteAll.Field()



schema = graphene.Schema(query = Query, mutation = Mutation)
