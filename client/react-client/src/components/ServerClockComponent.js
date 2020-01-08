import React from 'react';
import { useSubscription } from 'react-apollo';
import { gql } from 'apollo-boost';

const SERVER_CLOCK_QUERY = gql`
  subscription {
    serverClock
  }
`;

export default props => {
  const { data, loading, error } = useSubscription(SERVER_CLOCK_QUERY);
  return (
    <div className="box">
      <h5>Server Clock Component</h5>
      {data && <p className="small-text">{Date(data.serverClock)}</p>}
      {loading && <p>Loading...</p>}
      {error && <p>Error :( {error.message}</p>}
    </div>
  );
};
