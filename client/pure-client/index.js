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

const complexQuery = {
  query: `
    query {
      posts {
        body
        title
        user {
          salary
          nick
          todos {
            id
            title
            completed
          }
        }
      }
    }
 `
};

fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(complexQuery)
})
  .then(data => data.json())
  .then(data => console.log('data returned:', JSON.stringify(data)))
  .catch(err => console.log(err));
