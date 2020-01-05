import React from 'react';
import { useQuery } from '@apollo/react-hooks';
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

export default props => {
  const { loading, error, data } = useQuery(GET_USERS_QUERY);

  if (loading) return <p>Loading... {loading}</p>;
  if (error) return <p>Error :( {error.message}</p>;
  return (
    <div className="box">
      <h5>Fetch Users With Query Hook Component</h5>
      <ul className="small-text">
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
