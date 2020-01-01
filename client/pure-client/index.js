import fetch from 'node-fetch';
import readline from 'readline';

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

const updateUserMutation = {
  query: `
    mutation updateUser($input: UserInput) {
      updateUser(userId: 11, input: $input) {
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
      name: 'Pure Client Changed',
      userName: 'pureclient-changed',
      nick: 'prc',
      email: 'prc@gmail.com',
      isMale: true,
      salary: 111.11
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

const getUserError = {
  query: `
  query {
    singlePost(id: 3) {
      id
      title
    }
    getUserExceptionThrow {
      id
      name
      nick
    }
  }
 `
};

function callGraphqlApi(query) {
  // pure-client working with apollo-server
  // apollo-react-client working with pure-server
  fetch('http://localhost:2000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(query)
  })
    .then(data => data.json())
    .then(data => console.log('data returned:', JSON.stringify(data)))
    .catch(err => console.log(err));
}

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.question(
  `
============================================
 Which graphql operation do you want to run? 
  - createUserMutation
  - updateUserMutation
  - complexQuery
  - getUserError

`,
  answer => {
    console.log('calling...');
    callGraphqlApi(eval(answer));
    rl.close();
  }
);
