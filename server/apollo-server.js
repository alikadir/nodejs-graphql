import http from 'http';
import { ApolloServer, PubSub } from 'apollo-server-express';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import cors from 'cors';
import express from 'express';

import typeDefs from './schema/sdl-schema';
import resolvers from './schema/sdl-resolvers';

const pubSub = new PubSub();

const app = express();
app.use(cors());

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // mocks: true,
  context: context => {
    // added isMobile field to context object
    // websocket subscription context does not contains req,res
    context.isMobile = context.req ? context.req.headers['user-agent'].includes('iphone') : false;
    // websocket pubSub added context
    context.pubSub = pubSub;
    return context;
  },
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      // request, response ..etc are coming in context
      console.log('socket onConnect');
      console.log('onConnect-connectionParams', connectionParams);
      console.log('onConnect-webSocket', webSocket);
      console.log('onConnect-context', context);
    },
    onDisconnect: (webSocket, context) => {
      console.log('socket onDisconnect');
      console.log('onDisconnect-webSocket', webSocket);
      console.log('onDisconnect-context', context);
    }
  },
  validationRules: [createComplexityLimitRule(5000)] // default 1000
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
httpServer.listen(2000, () => {
  console.log(`🚀  Server ready at http://localhost:2000${server.graphqlPath}`);
  console.log(`🚀  Subscriptions ready at ws://localhost:2000${server.subscriptionsPath}`);
});
