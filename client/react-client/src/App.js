import { ApolloProvider } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import ApolloClient from 'apollo-boost';
import React from 'react';

import SampleComponent from './components/SampleComponent';
import UserList from './components/UserList';

import './App.css';
import logo from './logo.svg';
import BasicFetchComponent from './components/BasicFetchComponent';

const client = new ApolloClient({
  // pure-client working with apollo-server
  // apollo-react-client working with pure-server
  uri: 'http://localhost:1000/graphql'
});

client
  .query({
    query: gql`
      {
        users {
          name
          email
          salary
        }
      }
    `
  })
  .then(result => console.log(result));

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
          <UserList />
          <BasicFetchComponent />
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
