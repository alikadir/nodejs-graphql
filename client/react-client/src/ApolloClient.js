/* 
import ApolloClient from 'apollo-boost'

const client = new ApolloClient({
  // pure-client working with apollo-server
  // apollo-react-client working with pure-server
  uri: 'http://localhost:2000/graphql',

  // set jwt token at request header
  request: operation => {
    const token = localStorage.getItem('jwt');
    if (token) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${token}`
        }
      });
    }
  }
});

*/

import { split, ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import { ApolloClient, InMemoryCache } from 'apollo-boost';

const middlewareLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    operation.setContext({
      headers: {
        authorization: `Bearer ${token}`
      }
    });
  }
  return forward(operation);
});

// Create an http link:
const httpLink = middlewareLink.concat(
  createHttpLink({
    uri: 'https://akb-first-graphql-server.herokuapp.com/graphql'
  })
);

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `wss://akb-first-graphql-server.herokuapp.com/graphql`,
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);
const cache = new InMemoryCache();
export default new ApolloClient({ link, cache, cors: false });
