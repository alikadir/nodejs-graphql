import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';

const USERS = gql`
  {
    users {
      name
      email
      salary
    }
  }
`;

export default props => {
  //const [loading, error, data] = useQuery(USERS);

  /**/
  const loading = null;
  const error = 'alivali';
  const data = { users: [{ name: 'aaa', email: 'aa@aa.com', salary: 23.322 }] };

  if (loading) return <p>Loading... {loading}</p>;
  if (error) return <p>Error :( {error}</p>;
  if (!data) return <p>empty list</p>;
  return (
    <div>
      <ul>
        {data.users.map(x => (
          <li>
            {x.name} - {x.email}
            <br />
            {x.salary}
          </li>
        ))}
      </ul>
    </div>
  );
};
