import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

import postJson from './data/posts.json';

// String, Int, Float, Boolean, [], ID = String identity
// String! is a non-nullable string.

var typeDefs = gql`
  enum Status {
    new
    updated
    deleted
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
  }
  type Query {
    posts: [Post]
    singlePost(id: Int): Post
    userPosts(userId: Int): [Post]
    getPostsByStatus(status: Status): [Post]
  }
  type Mutation {
    sum(num1: Int, num2: Int): Float
  }
`;
// mutation is delete, update, create
// query is only select, that even to be a function

// mutation has two parameter, first parameter (maybe) parent second parameter args

var resolvers = {
  Query: {
    posts: () => postJson,
    singlePost: args => postJson.find(x => x.id == args.id),
    userPosts: args => postJson.filter(x => x.userId == args.userId),
    getPostsByStatus: args => postJson.filter(x => x.status == args.status)
  },
  Mutation: {
    sum: (parent, args) => args.num1 / args.num2
  }
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.listen(4000, () => console.log(`Now browse to http://localhost:4000${server.graphqlPath}`));
