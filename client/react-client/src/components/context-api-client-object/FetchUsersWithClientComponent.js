import { gql } from 'apollo-boost';
import { useApolloClient, ApolloConsumer } from '@apollo/react-hooks';
import React, { useState } from 'react';

import '../styles.css';

export default props => {
  const myClick = e => {
    client
      .query({
        query: gql`
          {
            users {
              id
              name
              email
              salary
            }
          }
        `
      })
      .then(result => {
        console.log(result);
        setUsers(result.data.users);
      })
      .catch(err => console.log(err));
  };

  // new context api hooks method
  const client = useApolloClient();
  const [users, setUsers] = useState([]);

  return (
    <div className="box">
      <h5>Fetch Users With Client Component</h5>
      <ul className="small-text">
        {users.map(x => (
          <li key={x.id}>
            {x.name} ({x.salary}) - {x.email}
          </li>
        ))}
      </ul>
      <button onClick={myClick}>Fetch Users With Client</button>
    </div>
  );
};

/* ======================
 And can also use following case (Old ContextApi Method) 
====================== */

export const FetchUserWithClientWithoutHook = props => {
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
