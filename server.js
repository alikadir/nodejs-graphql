import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

// String, Int, Float, Boolean, [], ID = String identity
// String! is a non-nullable string.

var typeDefs = gql`
  type Query {
    name: String
    id: Int
    age: Int
    isMale: Boolean
  }
`;

var resolvers = {
  Query: {
    name: () => 'Ali',
    id: () => 2,
    age: () => 34,
    isMale: () => true
  }
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app })

app.listen(4000, () => console.log(`Now browse to http://localhost:4000${server.graphqlPath}`));