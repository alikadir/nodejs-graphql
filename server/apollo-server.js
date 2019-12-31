import { ApolloServer, gql } from 'apollo-server-express';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import cors from 'cors';
import express from 'express';
import fetch from 'node-fetch';
import fs from 'fs';

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
    getUsersBetweenSalary: (parent, args, context, info) =>
      userJson
        .filter(x => x.salary > args.min && x.salary < args.max)
        .sort((a, b) => (args.ascending ? a.salary - b.salary : b.salary - a.salary)),
    getUserExceptionThrow: (parent, args, context, info) => {
      return args.aaa.bbb.ccc;
      // return 200 http code and there is "errors" field in result json
      // there is also other query field's "data" in result json
    }
  },
  User: {
    posts: (parent, args, context, info) => postJson.filter(x => x.userId == parent.id),
    comments: (parent, args, context, info) => commentJson.filter(x => x.userId == parent.id),
    todos: async (parent, args, context, info) =>
      await (await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${parent.id}`)).json()
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
    divide: (parent, args, context, info) => args.num1 / args.num2,
    createUser: async (parent, args, context, info) => {
      let id = userJson.sort((a, b) => b.id - a.id)[0].id;
      args.input.id = id + 1;

      userJson.push(args.input);
      let json = JSON.stringify(userJson);
      await fs.writeFileSync('./data/users.json', json);

      return args.input;
    }
  }
};

const app = express();
app.use(cors());
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // mocks: true,
  context: context => {
    // added isMobile field to context object
    context.isMobile = context.req.headers['user-agent'].includes('iphone');
    return context;
  },
  validationRules: [createComplexityLimitRule(5000)] // default 1000
});

server.applyMiddleware({ app });

app.listen(4000, () => console.log(` 🚀 Now browse to http://localhost:4000${server.graphqlPath}`));
