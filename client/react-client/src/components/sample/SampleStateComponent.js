import React, { useState, useEffect } from 'react';

export default props => {
  const [count, setCount] = useState(props.initCount);

  useEffect(() => {
    document.title = `Clicked ${count} times`;
  });

  return (
    <div className="box">
      <h5>Sample State Component</h5>
      <button onClick={() => setCount(count + 1)}>You clicked {count} times</button>
    </div>
  );
};
