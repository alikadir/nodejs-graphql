import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import React from 'react';

const CREATE_USER_MUTATION = gql`
  mutation createUser($input: UserInput) {
    createUser(input: $input) {
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
  let nameElm, userNameElm, nickElm, emailElm, isMaleElm, salaryElm;
  const [createUser, { loading, error, data }] = useMutation(CREATE_USER_MUTATION);

  if (loading) return <p>Loading... {loading}</p>;
  if (error) return <p>Error :( {error.message}</p>;

  return (
    <div className="box">
      <h5>Create User With Mutation Hook Component</h5>
      {data && (
        <div>
          <div>id: {data.createUser.id}</div>
          <div>name: {data.createUser.name}</div>
          <div>userName: {data.createUser.userName}</div>
          <div>nick: {data.createUser.nick}</div>
          <div>email: {data.createUser.email}</div>
          <div>isMale: {data.createUser.isMale.toString()}</div>
          <div>salary: {data.createUser.salary}</div>
        </div>
      )}
      <form
        className="small-text"
        onSubmit={e => {
          e.preventDefault();

          createUser({
            variables: {
              input: {
                name: nameElm.value,
                userName: userNameElm.value,
                nick: nickElm.value,
                email: emailElm.value,
                isMale: isMaleElm.checked,
                salary: parseFloat(salaryElm.value)
              }
            }
          })
            .then(result => console.log(result.data.createUser)) // same result
            .catch(err => console.log(err));
        }}>
        <label>
          Name
          <input
            type="text"
            required
            ref={elm => {
              nameElm = elm;
            }}></input>
        </label>
        <label>
          User Name
          <input
            type="text"
            required
            pattern="[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"
            ref={elm => {
              userNameElm = elm;
            }}></input>
        </label>
        <label>
          Nick
          <input
            type="text"
            required
            pattern="[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*"
            ref={elm => {
              nickElm = elm;
            }}></input>
        </label>
        <label>
          E-Mail
          <input
            type="email"
            required
            ref={elm => {
              emailElm = elm;
            }}></input>
        </label>
        <label>
          Is Male
          <input
            type="checkbox"
            ref={elm => {
              isMaleElm = elm;
            }}></input>
        </label>
        <label>
          Salary
          <input
            type="number"
            step="0.100"
            required
            ref={elm => {
              salaryElm = elm;
            }}></input>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
