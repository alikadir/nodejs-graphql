import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';

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
import SingIn from './components/SingInComponent';
import CreatedUserSubscription from './components/CreatedUserSubscriptionComponent';
import ServerClock from './components/ServerClockComponent';
import client from './ApolloClient';

import './App.css';
import logo from './logo.svg';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <SingIn />
          <img src={logo} className="App-logo" alt="logo" style={{ display: 'none' }} />
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
          <Collapse title="Subscription">
            <ServerClock />
            <CreatedUserSubscription />
          </Collapse>
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
