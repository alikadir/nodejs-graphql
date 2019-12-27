import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLID
} from 'graphql';
import postJson from '../data/posts.json';
import userJson from '../data/users.json';

const StatusType = new GraphQLEnumType({
  name: 'Status',
  values: {
    New: { value: 'new' },
    Updated: { value: 'updated' },
    Deleted: { value: 'deleted' }
  }
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    userName: { type: GraphQLString },
    email: { type: GraphQLString },
    posts: {
      type: GraphQLList(PostType),
      resolve(parent) {
        return postJson.filter(x => x.userId == parent.id);
      }
    }
  })
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLInt },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLString, description: 'title is describe to post js' },
    body: { type: GraphQLString },
    status: { type: StatusType },
    user: {
      type: UserType,
      resolve(parent) {
        return userJson.find(x => x.id == parent.userId);
      }
    }
  }
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      posts: {
        type: GraphQLList(PostType),
        resolve() {
          return postJson;
        }
      },
      users: {
        type: GraphQLList(UserType),
        resolve(parent, args, context, info) {
          return userJson;
        }
      },
      singlePost: {
        type: PostType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args) {
          return postJson.find(x => x.id == args.id);
        }
      },
      userPosts: {
        type: GraphQLList(PostType),
        args: { userId: { type: GraphQLID } },
        resolve(parent, args) {
          return postJson.filter(x => x.userId == args.userId);
        }
      },
      getPostsByStatus: {
        type: GraphQLList(PostType),
        args: {
          status: { type: StatusType }
        },
        resolve(parent, args) {
          return postJson.filter(x => x.status == args.status);
        }
      }
    }
  })
});
