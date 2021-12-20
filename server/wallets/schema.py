import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from graphene_django import DjangoObjectType
from .models import User
from posts.models import Post
from posts.schema import PostType
from wallet.models import Wallet

from graphene_django.forms.converter import convert_form_field
from django_filters.fields import MultipleChoiceField
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required


class WalletType(DjangoObjectType):
    class Meta:
        model = Wallet
        fields = ("")

class AuthMutation(graphene.ObjectType):
    register = mutations.Register.Field()
    verify_account = mutations.VerifyAccount.Field()
    update_account = mutations.UpdateAccount.Field()
    resend_activation_email = mutations.ResendActivationEmail.Field()
    send_passord_reset_email = mutations.SendPasswordResetEmail.Field()
    password_reset = mutations.PasswordReset.Field()


class Mutation(graphene.ObjectType):
    login = Login.Field()
    logout = Logout.Field()
    test = Test.Field()
    add_following = AddFollowing.Field()
    stop_following = StopFollowing.Field()

schema = graphene.Schema(mutation=Mutation)


