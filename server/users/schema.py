import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from graphene_django import DjangoObjectType
from .models import User
from posts.models import Post
from posts.schema import PostType
from wallets.models import Wallet
from wallets.schema import WalletType
from web3 import Web3
from eth_account.messages import encode_defunct
import random

from graphene_django.forms.converter import convert_form_field
from django_filters.fields import MultipleChoiceField
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required


    

class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    update_account = mutations.UpdateAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_passord_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()



class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "username", "following", "numfollowers", "owned_post", "wallets", "posts", "nonce", "bio", "user_status")


class Login(graphene.Mutation):
    class Arguments:
        username = graphene.String()
        password = graphene.String()
    ok = graphene.Boolean()
    user = graphene.Field(UserType)
    def mutate(root, info, username, password):
        print("1")
        user_instance = authenticate(username=username, password=password)
        print(user_instance)
        if user_instance is not None:
            login(info.context, user_instance)
            return Login(ok=True, user=user_instance)
        else:
            username = User.objects.filter(email=username)
            if(len(username) is 0):
                return Login(ok=False, user=None)
            username = username[0]
            user_instance = authenticate(username=username, password=password)
            if user_instance is not None:
                login(info.context, user_instance)
                return Login(ok = True, user=user_instance)
            return Login(ok=False, user=None)

class Logout(graphene.Mutation):
    ok = graphene.Boolean()
    def mutate(root, info):
        logout(info.context)
        return Logout(ok=True)


#ok is true if authenticated, flase if not
class AddFollowing(graphene.Mutation):
    class Arguments:
        username = graphene.String()
    ok = graphene.Boolean()
    person_to_follow = graphene.Field(UserType)
    def mutate(root, info, username):
        if not info.context.user.is_authenticated:
            return AddFollowing(ok=False, person_to_follow=None)
        following = User.objects.get(username=username)
        if following is None:
            return AddFollowing(ok=False, person_to_follow=None)
        
        user_instance = info.context.user
        if following in user_instance.following.all():
            return AddFollowing(ok = False, person_to_follow=None)
        user_instance.following.add(following)
        following.numfollowers += 1
        following.save()
        return AddFollowing(ok=True, person_to_follow=following)

#ok is true if authenticated, flase if not
class StopFollowing(graphene.Mutation):
    class Arguments:
        username = graphene.String()
    ok = graphene.Boolean()
    def mutate(root, info, username):
        if not info.context.user.is_authenticated:
            return StopFollowing(ok=False)
        user_to_stop_following = User.objects.get(username=username)
        if user_to_stop_following is None:
            return StopFollowing(ok=False)
        user_instance = info.context.user
        if not user_to_stop_following in user_instance.following.all():
            return StopFollowing(ok = False)
        user_instance.following.remove(user_to_stop_following)
        user_to_stop_following.numfollowers -= 1
        user_to_stop_following.save()
        return StopFollowing(ok=True)

class ChangeBio(graphene.Mutation):
    class Arguments:
        bio_change = graphene.String()
    ok = graphene.Boolean()
    def mutate(root, info, bio_change):
        if not info.context.user.is_authenticated:
            return ChangeBio(ok=False)
        user_instance = info.context.user
        user_instance.bio = bio_change
        user_instance.save()
        return ChangeBio(ok=True)




#remeber to delete this
class Test(graphene.Mutation):
    ok = graphene.Boolean()
    def mutate(root, info):
        if not info.context.user.is_authenticated:
            return Logout(ok=False)
        return Logout(ok=True)

class AddWallet(graphene.Mutation):
    class Arguments:
        nonce = graphene.String()
        signature = graphene.String()
    ok = graphene.Boolean()
    err = graphene.String()
    wallet = graphene.Field(WalletType)
    def mutate(root, info, nonce, signature):
        w3 = Web3()
        user_instance = info.context.user
        if user_instance is None:
            return AddWallet(ok = false, err = "not authenitcated",wallet = None)
        if(nonce != str(user_instance.nonce)):
            return AddWallet(ok = False, err = "wrong nonce", wallet = None)
        message = encode_defunct(text=nonce)
        wallet_address = w3.eth.account.recover_message(message, signature=signature)
        for i in user_instance.wallets.all():
            if(i.address == wallet_address):
                return AddWallet(ok = False, err = "wallet already added", wallet = None)
        wallet_to_add = Wallet(address=wallet_address)
        wallet_to_add.save()
        wallet_to_add.owner.add(user_instance)
        user_instance.nonce = random.randrange(1, 1000000)
        user_instance.save()
        return AddWallet(ok=True, wallet=None)

class DeleteWallet(graphene.Mutation):
    class Arguments:
        id = graphene.Int()
    ok = graphene.Boolean()
    err = graphene.String()
    def mutate(root, info, id):
        user_instance = info.context.user
        wallet_to_delete = Wallet.objects.get(id = id)
        if wallet_to_delete is None:
            return DeleteWallet(ok = False, err = "wallet does not exist")
        if user_instance is None:
            return DeleteWallet(ok = False, err = "not authenticated")
        if not(user_instance in wallet_to_delete.owner.all()):
            return DeleteWallet(ok = False, err = "user does not own wallet")
        wallet_to_delete.delete()
        
        return DeleteWallet(ok = True)

class Query(UserQuery, MeQuery, graphene.ObjectType):
    specific_user = graphene.Field(UserType, username = graphene.String())
    search_users = graphene.List(UserType, searchstring = graphene.String(), numresults = graphene.Int())
    def resolve_specific_user(root, info, username):
        return User.objects.get(username = username)
    def resolve_search_users(root, info, searchstring, numresults):
        user_list = User.objects.filter(username__icontains=searchstring)
        return user_list.order_by('-numfollowers')[:numresults]




class Mutation(AuthMutation, graphene.ObjectType):
    login = Login.Field()
    logout = Logout.Field()
    test = Test.Field()
    add_following = AddFollowing.Field()
    stop_following = StopFollowing.Field()
    change_bio = ChangeBio.Field()
    add_wallet = AddWallet.Field()
    delete_wallet = DeleteWallet.Field()

schema = graphene.Schema(query = Query, mutation=Mutation)


