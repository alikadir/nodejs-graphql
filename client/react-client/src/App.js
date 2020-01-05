import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';

import FetchUsersWithClientComponent, {
  FetchUserWithClientWithoutHookComponent
} from './components/context-api-client-object/FetchUsersWithClientComponent';
import CreateUsersWithClientComponent, {
  CreateUserWithClientWithoutHookComponent
} from './components/context-api-client-object/CreateUsersWithClientComponent';
import FetchUsersWithQueryHookComponent from './components/react-hook/FetchUsersWithQueryHookComponent';
import FetchUsersWithQueryComponent from './components/react-component/FetchUsersWithQueryComponent';
import SampleComponent from './components/SampleComponent';
import CollapseComponent from './components/CollapseComponent';
import CreateUserWithMutationHookComponent from './components/react-hook/CreateUserWithMutationHookComponent';
import CreateUserWithMutationComponent from './components/react-component/CreateUserWithMutationComponent';

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
          <CollapseComponent title="Query">
            <FetchUsersWithQueryHookComponent />
            <FetchUsersWithQueryComponent />
            <FetchUsersWithClientComponent />
            <FetchUserWithClientWithoutHookComponent />
          </CollapseComponent>
          <CollapseComponent title="Mutation">
            <CreateUserWithMutationHookComponent />
            <CreateUserWithMutationComponent />
            <CreateUsersWithClientComponent />
            <CreateUserWithClientWithoutHookComponent />
          </CollapseComponent>
          <SampleComponent initCount={3} />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
