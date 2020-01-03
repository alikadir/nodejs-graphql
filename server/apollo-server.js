import { ApolloServer, gql } from 'apollo-server-express';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import cors from 'cors';
import express from 'express';

import typeDefs from './schema/sdl-schema';
import resolvers from './schema/sdl-resolvers';

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

app.listen(2000, () => console.log(` 🚀 Now browse to http://localhost:2000${server.graphqlPath}`));
