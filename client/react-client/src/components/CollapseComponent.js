import React, { useState } from 'react';
import Collapsible from 'react-collapsible';

import './styles.css';

export default props => {
  const [active, setActive] = useState(false);
  return (
    <Collapsible
      trigger={
        <div className={active ? 'bar-button active' : 'bar-button'} onClick={e => setActive(!active)}>
          {props.title}
        </div>
      }>
      {props.children}
    </Collapsible>
  );
};
