import { ApolloServer, gql } from 'apollo-server-express';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import express from 'express';
import fetch from 'node-fetch';

import { fieldMapResolver } from './utilities/graphql-utility';
import externalSchema from './schema/sdl-schema';

import commentJson from './data/comments.json';
import postJson from './data/posts.json';
import userJson from './data/users.json';

const typeDefs = externalSchema;

// mutation is delete, update, create
// query is only select, that even to be a function

const resolvers = {
  Query: {
    posts: (parent, args, context, info) => postJson,
    users: (parent, args, context, info) => {
      console.log(fieldMapResolver(info.fieldNodes[0]));
      console.log(context.isMobile);
      return userJson;
    },
    comments: (parent, args, context, info) => commentJson,
    todos: async (parent, args, context, info) => await (await fetch('https://jsonplaceholder.typicode.com/todos')).json(),
    singlePost: (parent, args, context, info) => postJson.find(x => x.id == args.id),
    userPosts: (parent, args, context, info) => postJson.filter(x => x.userId == args.userId),
    getPostsByStatus: (parent, args, context, info) => postJson.filter(x => x.status == args.status),
    getUsersBetweenSalary: (parent, args, context, info) => userJson.filter(x => x.salary > args.min && x.salary < args.max)
  },
  User: {
    posts: (parent, args, context, info) => postJson.filter(x => x.userId == parent.id),
    comments: (parent, args, context, info) => commentJson.filter(x => x.userId == parent.id),
    todos: async (parent, args, context, info) => await (await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${parent.id}`)).json()
  },
  Post: {
    user: (parent, args, context, info) => userJson.find(x => x.id == parent.userId),
    comments: (parent, args, context, info) => commentJson.filter(x => x.postId == parent.id)
  },
  Comment: {
    user: (parent, args, context, info) => userJson.find(x => x.id == parent.userId),
    post: (parent, args, context, info) => postJson.find(x => x.id == parent.postId)
  },
  Mutation: {
    sum: (parent, args, context, info) => args.num1 / args.num2
  }
};

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: context => {
    // added isMobile field to context object
    context.isMobile = context.req.headers['user-agent'].includes('iphone');
    return context;
  },
  validationRules: [createComplexityLimitRule(5000)] // default 1000
});

server.applyMiddleware({ app });

app.listen(4000, () => console.log(` 🚀 Now browse to http://localhost:4000${server.graphqlPath}`));
