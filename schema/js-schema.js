import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean
} from 'graphql';
import { fieldMapResolver } from '../utilities/graphql-utility';
import fetch from 'node-fetch';

import commentJson from '../data/comments.json';
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

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    user: {
      type: UserType,
      resolve(parent, args, context, info) {
        return userJson.find(x => x.id == parent.userId);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: new GraphQLNonNull(GraphQLString) },
    userName: { type: GraphQLString, deprecationReason: 'You should use "nick" instead of userName field' },
    nick: { type: GraphQLString },
    email: { type: GraphQLString, deprecationReason: ' ' },
    isMale: { type: GraphQLBoolean },
    salary: { type: GraphQLFloat },
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
    },
    todos: {
      type: GraphQLList(TodoType),
      async resolve(parent, args, context, info) {
        return await (await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${parent.id}`)).json();
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
    title: { type: GraphQLString, description: 'title is describe to post custom description' },
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

      todos: {
        type: GraphQLList(TodoType),
        async resolve(parent, args, context, info) {
          return await (await fetch('https://jsonplaceholder.typicode.com/todos')).json();
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
      },
      getUsersBetweenSalary: {
        type: GraphQLList(UserType),
        args: {
          max: { type: GraphQLFloat },
          min: { type: GraphQLFloat }
        },
        resolve(parent, args, context, info) {
          return userJson.filter(x => x.salary > args.min && x.salary < args.max);
        }
      }
    }
  })
});
