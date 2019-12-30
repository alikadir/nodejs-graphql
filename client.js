import fetch from 'node-fetch';

const createUserMutation = {
  query: `
    mutation createUser($input: UserInput) {
      createUser(input: $input) {
        id
        name
        userName
        isMale
        salary
        email
      }
    }
 `,
  variables: {
    input: {
      name: 'Pure Client',
      userName: 'pureclient',
      nick: 'pr',
      email: 'pr@gmail.com',
      isMale: false,
      salary: 145.33
    }
  }
};

fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(createUserMutation)
})
  .then(data => data.json())
  .then(data => console.log('data returned:', data))
  .catch(err => console.log(err));
