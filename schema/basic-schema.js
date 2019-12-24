import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType
} from 'graphql';
import postJson from '../data/posts.json';

const status = new GraphQLEnumType({
  name: 'Status',
  values: {
    New: { value: 'new' },
    Updated: { value: 'updated' },
    Deleted: { value: 'deleted' }
  }
});

const post = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: GraphQLInt },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLString, description: 'title is describe to post js' },
    body: { type: GraphQLString },
    status: { type: status }
  }
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      posts: {
        type: GraphQLList(post),
        resolve() {
          return postJson;
        }
      },
      singlePost: {
        type: post,
        args: { id: { type: GraphQLInt } },
        resolve(parent, args) {
          return postJson.find(x => x.id == args.id);
        }
      },
      userPosts: {
        type: GraphQLList(post),
        args: { userId: { type: GraphQLInt } },
        resolve(parent, args) {
          return postJson.filter(x => x.userId == args.userId);
        }
      },
      getPostsByStatus: {
        type: GraphQLList(post),
        args: {
          status: { type: status }
        },
        resolve(parent, args) {
          return postJson.filter(x => x.status == args.status);
        }
      }
    }
  })
});
