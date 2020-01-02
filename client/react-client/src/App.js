import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient from 'apollo-boost';
import React from 'react';

import FetchUsersWithClientComponent from './components/FetchUsersWithClientComponent';
import FetchUsersWithQueryHookComponent from './components/FetchUsersWithQueryHookComponent';
import FetchUsersWithQueryComponent from './components/FetchUsersWithQueryComponent';
import SampleComponent from './components/SampleComponent';

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
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <SampleComponent initCount={3} />
          <FetchUsersWithQueryHookComponent />
          <FetchUsersWithQueryComponent />
          <FetchUsersWithClientComponent />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
