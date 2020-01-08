import http from 'http';
import { ApolloServer, PubSub } from 'apollo-server-express';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import cors from 'cors';
import express from 'express';

import typeDefs from './schema/sdl-schema';
import resolvers from './schema/sdl-resolvers';

const pubSub = new PubSub();

// subscribtion publish server clock
setInterval(() => {
  pubSub.publish('server-clock', { serverClock: Date.now() });
}, 1000);

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
    },
    onDisconnect: (webSocket, context) => {}
  },
  validationRules: [createComplexityLimitRule(5000)], // default 1000
  introspection: true, // playground enable production
  playground: true
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const PORT = process.env.PORT || 2000;

httpServer.listen(PORT, () => {
  console.log(`🚀  Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(`🚀  Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`);
});
