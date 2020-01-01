import React, { useState, useEffect } from 'react';

export default props => {
  const [count, setCount] = useState(props.initCount);

  useEffect(() => {
    document.title = `Clicked ${count} times`;
  });

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>You clicked {count} times</button>
    </div>
  );
};
