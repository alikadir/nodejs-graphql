import React from 'react';
import { Query } from 'react-apollo';
import { gql } from 'apollo-boost';

import '../styles.css';

const GET_USERS_QUERY = gql`
  {
    users {
      id
      name
      email
      salary
    }
  }
`;

export default props => (
  <Query query={GET_USERS_QUERY}>
    {result => {
      if (result.loading) return <p>Loading...</p>;
      if (result.error) return <p>Error :( {result.error.message}</p>;

      return (
        <div className="box">
          <h5>Fetch Users With Query Component</h5>
          <ul className="small-text">
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
