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
import { fieldMapResolver } from '../utilities/graphql-utility';

import postJson from '../data/posts.json';
import userJson from '../data/users.json';
import commentJson from '../data/comments.json';

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
    userName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: GraphQLString },
    posts: {
      type: GraphQLList(PostType),
      resolve(parent, args, context, info) {
        return postJson.filter(x => x.userId == parent.id);
      }
    },
    comments: {
      type: GraphQLList(CommentType),
      resolve(parent, args, context, info) {
        return comment.filter(x => x.userId == parent.id);
      }
    }
  })
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    PostId: { type: GraphQLInt },
    subject: { type: GraphQLString },
    body: { type: GraphQLString },
    post: {
      type: PostType,
      resolve(parent, args, context, info) {
        return postJson.find(x => x.id == parent.PostId);
      }
    },
    user: {
      type: UserType,
      resolve(parent, args, context, info) {
        return userJson.find(x => x.id == parent.userId);
      }
    }
  })
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLString, description: 'title is describe to post js' },
    body: { type: GraphQLString },
    status: { type: StatusType },
    user: {
      type: UserType,
      resolve(parent, args, context, info) {
        return userJson.find(x => x.id == parent.userId);
      }
    },
    comments: {
      type: GraphQLList(CommentType),
      resolve(parent, args, context, info) {
        return commentJson.filter(x => x.postId == parent.id);
      }
    }
  })
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      posts: {
        type: GraphQLList(PostType),
        resolve(parent, args, context, info) {
          return postJson;
        }
      },
      users: {
        type: GraphQLList(UserType),
        resolve(parent, args, context, info) {
          console.log(fieldMapResolver(info.fieldNodes[0]));
          console.log(context.isMobile);
          return userJson;
        }
      },
      singlePost: {
        type: PostType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args, context, info) {
          return postJson.find(x => x.id == args.id);
        }
      },
      userPosts: {
        type: GraphQLList(PostType),
        args: { userId: { type: GraphQLID } },
        resolve(parent, args, context, info) {
          return postJson.filter(x => x.userId == args.userId);
        }
      },
      getPostsByStatus: {
        type: GraphQLList(PostType),
        args: {
          status: { type: StatusType }
        },
        resolve(parent, args, context, info) {
          return postJson.filter(x => x.status == args.status);
        }
      }
    }
  })
});
