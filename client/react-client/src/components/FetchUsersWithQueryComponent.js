import React from 'react';
import { Query } from 'react-apollo';
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

export default props => (
  <Query query={USERS}>
    {result => {
      if (result.loading) return <p>Loading...</p>;
      if (result.error) return <p>Error :( {result.error.message}</p>;

      return (
        <div style={styles.box}>
          <ul style={styles.smallText}>
            {result.data.users.map(x => (
              <li key={x.id}>
                {x.name} ({x.salary}) - {x.email}
                <br />
              </li>
            ))}
          </ul>
        </div>
      );
    }}
  </Query>
);
