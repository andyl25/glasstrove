import graphene
from graphene_django import DjangoObjectType
#from .models import Video
import users.schema
import posts.schema
import wallets.schema
from graphene_django.debug import DjangoDebug


class Query(
    users.schema.Query,
    posts.schema.Query,
    wallets.schema.Query,
):
    pass

class Mutation(
    users.schema.Mutation,
    posts.schema.Mutation,
):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
