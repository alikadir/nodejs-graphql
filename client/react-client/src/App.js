import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import FetchUsersWithClient, {
  FetchUserWithClientWithoutHook
} from './components/context-api-client-object/FetchUsersWithClientComponent';
import CreateUsersWithClient, {
  CreateUserWithClientWithoutHook
} from './components/context-api-client-object/CreateUsersWithClientComponent';
import FetchUsersWithQueryHook from './components/react-hook/FetchUsersWithQueryHookComponent';
import FetchUsersWithQuery from './components/react-component/FetchUsersWithQueryComponent';
import SampleState from './components/sample/SampleStateComponent';
import { SampleFormWithState, SampleFormWithElement } from './components/sample/SampleFormComponent';
import Collapse from './components/CollapseComponent';
import CreateUserWithMutationHook from './components/react-hook/CreateUserWithMutationHookComponent';
import CreateUserWithMutation from './components/react-component/CreateUserWithMutationComponent';

import './App.css';
import logo from './logo.svg';

const client = new ApolloClient({
  // pure-client working with apollo-server
  // apollo-react-client working with pure-server
  uri: 'http://localhost:1000/graphql'
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Collapse title="Sample">
            <SampleState initCount={3} />
            <SampleFormWithState />
            <SampleFormWithElement />
          </Collapse>
          <Collapse title="Query">
            <FetchUsersWithQueryHook />
            <FetchUsersWithQuery />
            <FetchUsersWithClient />
            <FetchUserWithClientWithoutHook />
          </Collapse>
          <Collapse title="Mutation">
            <CreateUserWithMutationHook />
            <CreateUserWithMutation />
            <CreateUsersWithClient />
            <CreateUserWithClientWithoutHook />
          </Collapse>
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
