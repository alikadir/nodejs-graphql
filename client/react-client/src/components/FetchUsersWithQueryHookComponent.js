import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const USERS = gql`
  {
    users {
      id
      name
      email
      salary
    }
  }
`;

const styles = {
  box: { border: '1px solid gray', borderRadius: 7 },
  smallText: {
    fontSize: 12
  },
  largeText: {
    fontSize: 15
  }
};

export default props => {
  const { loading, error, data } = useQuery(USERS);

  /*
  const loading = null;
  const error = 'alivali';
  const data = { users: [{ name: 'aaa', email: 'aa@aa.com', salary: 23.322 }] };
*/

  if (loading) return <p>Loading... {loading}</p>;
  if (error) return <p>Error :( {error.message}</p>;
  return (
    <div style={styles.box}>
      <ul style={styles.smallText}>
        {data.users.map(x => (
          <li key={x.id}>
            {x.name} ({x.salary}) - {x.email}
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};
