import React, { useState } from 'react';

export const SampleFormWithState = props => {
  const [state, setState] = useState(null);

  const onChange = e => {
    setState({
      ...state,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="box">
      <h5>Sample Form With State</h5>
      <form>
        <label>
          Title
          <input type="text" name="title" onChange={onChange} />
        </label>
        <label>
          Description
          <input type="text" name="description" onChange={onChange} />
        </label>
        <code className="small-text">{JSON.stringify(state)}</code>
      </form>
    </div>
  );
};

export const SampleFormWithElement = props => {
  let formElm, titleElm, descriptionElm;
  const [state, setState] = useState(null);

  const onSubmit = e => {
    e.preventDefault();
    setState({
      title: titleElm.value,
      description: descriptionElm.value
    });
    formElm.reset();
  };

  return (
    <div className="box">
      <h5>Sample Form With Element</h5>
      <form
        onSubmit={onSubmit}
        ref={elm => {
          formElm = elm;
        }}>
        <label>
          Title
          <input
            type="text"
            ref={elm => {
              titleElm = elm;
            }}
          />
        </label>
        <label>
          Description
          <input
            type="text"
            ref={elm => {
              descriptionElm = elm;
            }}
          />
        </label>
        <button type="submit">Submit</button>
        <br />
        <code className="small-text">{JSON.stringify(state)}</code>
      </form>
    </div>
  );
};
