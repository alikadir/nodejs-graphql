import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';

import { fieldMapResolver } from './utilities/graphql-utility';

import postJson from './data/posts.json';
import userJson from './data/users.json';

// String, Int, Float, Boolean, [], ID = String or Int
// String! is a non-nullable string.

const typeDefs = gql`
  enum Status {
    new
    updated
    deleted
  }

  type User {
    id: Int
    name: String
    userName: String!
    email: String
    posts: [Post]
  }

  type Post {
    id: Int
    userId: Int!
    """
    title is describe the post
    """
    title: String
    body: String
    status: Status
    user: User
  }

  type Query {
    posts: [Post]
    users: [User]
    singlePost(id: ID): Post
    userPosts(userId: ID): [Post]
    getPostsByStatus(status: Status): [Post]
  }

  type Mutation {
    sum(num1: Int, num2: Int): Float
  }
`;

// mutation is delete, update, create
// query is only select, that even to be a function

// mutation has two parameter, first parameter (maybe) parent second parameter args

const resolvers = {
  Query: {
    posts: (parent, args, context, info) => postJson,
    users: (parent, args, context, info) => {
      console.log(fieldMapResolver(info.fieldNodes[0]));
      return userJson;
    },
    singlePost: (parent, args, context, info) => postJson.find(x => x.id == args.id),
    userPosts: (parent, args, context, info) => postJson.filter(x => x.userId == args.userId),
    getPostsByStatus: (parent, args, context, info) => postJson.filter(x => x.status == args.status)
  },
  User: {
    posts: (parent, args, context, info) => postJson.filter(x => x.userId == parent.id)
  },
  Post: {
    user: (parent, args, context, info) => userJson.find(x => x.id == parent.userId)
  },
  Mutation: {
    sum: (parent, args, context, info) => args.num1 / args.num2
  }
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen(4000, () => console.log(`Now browse to http://localhost:4000${server.graphqlPath}`));
