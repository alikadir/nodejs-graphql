import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo';
import jwt from 'jsonwebtoken';
import { gql } from 'apollo-boost';

const SIGN_IN_QUERY = gql`
  mutation($userName: String!, $password: String!) {
    signIn(userName: $userName, password: $password)
  }
`;

export default props => {
  const readWriteToken = token => {
    if (token) localStorage.setItem('jwt', token);
    let storedToken = localStorage.getItem('jwt');
    if (storedToken) return jwt.decode(storedToken);
  };

  let userNameElm, passwordElm;
  const client = useApolloClient();
  const [admin, setAdmin] = useState(readWriteToken());
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
    client
      .mutate({ mutation: SIGN_IN_QUERY, variables: { userName: userNameElm.value, password: passwordElm.value } })
      .then(result => {
        setAdmin(readWriteToken(result.data.signIn));
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="box">
      <h5>Sign In Component</h5>
      {admin && <p className="small-text">Logged in user: {admin.userName}</p>}
      <form className="small-text" onSubmit={onSubmit}>
        <label>
          User Name
          <input type="text" ref={elm => (userNameElm = elm)}></input>
        </label>
        <label>
          Password
          <input type="password" ref={elm => (passwordElm = elm)}></input>
        </label>
        <button type="submit">Sing In</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error :( {error.message}</p>}
    </div>
  );
};
