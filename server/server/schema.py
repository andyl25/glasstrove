import graphene
from graphene_django import DjangoObjectType
#from .models import Video
import users.schema
from graphene_django.debug import DjangoDebug


class Query(
    users.schema.Query,
    graphene.ObjectType,
):
    pass

class Mutation(
    users.schema.AuthMutation,
):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
