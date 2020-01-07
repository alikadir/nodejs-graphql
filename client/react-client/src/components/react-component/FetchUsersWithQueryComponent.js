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
    {result => (
      <div className="box">
        <h5>Fetch Users With Query Component</h5>
        <ul className="small-text">
          {result.data &&
            result.data.users.map(x => (
              <li key={x.id}>
                {x.name} ({x.salary}) - {x.email}
                <br />
              </li>
            ))}
        </ul>
        <button
          onClick={e => {
            result.refetch();
          }}>
          Refetch!
        </button>
        {result.loading && <p>Loading...</p>}
        {result.error && <p>Error :( {result.error.message}</p>}
      </div>
    )}
  </Query>
);
