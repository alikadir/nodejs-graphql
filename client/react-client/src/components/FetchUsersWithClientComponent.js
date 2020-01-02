import React, { useContext, useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

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

  const client = useApolloClient();
  const [users, setUsers] = useState([]);

  const styles = {
    box: { border: '1px solid gray', borderRadius: 7 },
    smallText: {
      fontSize: 12
    },
    largeText: {
      fontSize: 15
    }
  };

  return (
    <div style={styles.box}>
      <ul style={styles.smallText}>
        {users.map(x => (
          <li key={x.id}>
            {x.name} ({x.salary}) - {x.email}
          </li>
        ))}
      </ul>
      <button style={styles.largeText} onClick={myClick}>
        Fetch Users With Client
      </button>
    </div>
  );
};
