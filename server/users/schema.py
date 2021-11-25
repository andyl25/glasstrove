import graphene
from graphql_auth.schema import UserQuery, MeQuery
from graphql_auth import mutations
from graphene_django import DjangoObjectType
from .models import User
from posts.models import Post
from posts.schema import PostType

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
        fields = ("id", "username", "following", "numfollowers", "owned_post")


class Login(graphene.Mutation):
    class Arguments:
        username = graphene.String()
        password = graphene.String()
    ok = graphene.Boolean()
    user = graphene.Field(UserType)
    def mutate(root, info, username, password):
        user_instance = authenticate(username=username, password=password)
        if user_instance is not None:
            login(info.context, user_instance)
            return Login(ok=True, user=user_instance)
        else:
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
        user_instance.following.remove(user_to_stop_following)
        user_to_stop_following.numfollowers -= 1
        user_to_stop_following.save()
        return StopFollowing(ok=True)





#remeber to delete this
class Test(graphene.Mutation):
    ok = graphene.Boolean()
    def mutate(root, info):
        if not info.context.user.is_authenticated:
            return Logout(ok=False)
        return Logout(ok=True)

        
class Query(UserQuery, MeQuery, graphene.ObjectType):
    specific_user = graphene.Field(UserType, username = graphene.String())
    def resolve_specific_user(root, info, username):
        return User.objects.get(username = username)


class Mutation(AuthMutation, graphene.ObjectType):
    login = Login.Field()
    logout = Logout.Field()
    test = Test.Field()
    add_following = AddFollowing.Field()
    stop_following = StopFollowing.Field()

schema = graphene.Schema(query = Query, mutation=Mutation)


