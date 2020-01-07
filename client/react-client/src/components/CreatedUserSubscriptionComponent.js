import React from 'react';
import { useSubscription } from 'react-apollo';
import { gql } from 'apollo-boost';

const CREATED_USER_QUERY = gql`
  subscription {
    createdUser {
      id
      name
      userName
      nick
      email
      isMale
      salary
    }
  }
`;

export default props => {
  const { data, loading, error } = useSubscription(CREATED_USER_QUERY);
  return (
    <div className="box">
      <h5>Created User Subscription Component</h5>
      {data && <p className="small-text">{JSON.stringify(data.createdUser)}</p>}
      {loading && <p>Loading...</p>}
      {error && <p>Error :( {error.message}</p>}
    </div>
  );
};
