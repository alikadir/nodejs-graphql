import { gql } from 'apollo-boost';
import { useApolloClient, ApolloConsumer } from '@apollo/react-hooks';
import React, { useState } from 'react';

import '../styles.css';

export default props => {
  // new context api hooks method
  const client = useApolloClient();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  let nameElm, userNameElm, nickElm, emailElm, isMaleElm, salaryElm;

  return (
    <div className="box">
      <h5>Create User With Client Component</h5>
      {data && (
        <div>
          <div>id: {data.createUser.id}</div>
          <div>name: {data.createUser.name}</div>
          <div>userName: {data.createUser.userName}</div>
          <div>nick: {data.createUser.nick}</div>
          <div>email: {data.createUser.email}</div>
          <div>isMale: {data.createUser.isMale.toString()}</div>
          <div>salary: {data.createUser.salary}</div>
        </div>
      )}
      <form
        className="small-text"
        onSubmit={e => {
          e.preventDefault();
          setLoading(true);
          client
            .mutate({
              mutation: gql`
                mutation createUser($input: UserInput) {
                  createUser(input: $input) {
                    id
                    name
                    userName
                    nick
                    email
                    isMale
                    salary
                  }
                }
              `,
              variables: {
                input: {
                  name: nameElm.value,
                  userName: userNameElm.value,
                  nick: nickElm.value,
                  email: emailElm.value,
                  isMale: isMaleElm.checked,
                  salary: parseFloat(salaryElm.value)
                }
              }
            })
            .then(result => {
              setData(result.data);
            })
            .catch(err => {
              setError(err);
            })
            .finally(() => {
              setLoading(null);
            });
        }}>
        <label>
          Name
          <input
            type="text"
            required
            ref={elm => {
              nameElm = elm;
            }}></input>
        </label>
        <label>
          User Name
          <input
            type="text"
            required
            pattern="[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"
            ref={elm => {
              userNameElm = elm;
            }}></input>
        </label>
        <label>
          Nick
          <input
            type="text"
            required
            pattern="[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"
            ref={elm => {
              nickElm = elm;
            }}></input>
        </label>
        <label>
          E-Mail
          <input
            type="email"
            required
            ref={elm => {
              emailElm = elm;
            }}></input>
        </label>
        <label>
          Is Male
          <input
            type="checkbox"
            ref={elm => {
              isMaleElm = elm;
            }}></input>
        </label>
        <label>
          Salary
          <input
            type="number"
            step="0.100"
            required
            ref={elm => {
              salaryElm = elm;
            }}></input>
        </label>
        <button type="submit">Submit</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p>Error :( {error.message}</p>}
    </div>
  );
};

/* ======================
 And can also use following case (Old ContextApi Method) 
====================== */

export const CreateUserWithClientWithoutHook = props => {
  return (
    <div className="box">
      <ApolloConsumer>
        {client => 'We have access to the client in Client Without Hook Component'
        /* do stuff here */
        }
      </ApolloConsumer>
    </div>
  );
};
