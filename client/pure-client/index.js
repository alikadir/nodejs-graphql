import fetch from 'node-fetch';
import readline from 'readline';

// using gql is optional !!
// you can string for query schema !!

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
      userName: 'pure-client',
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
      userName: 'pure-client-changed',
      nick: 'prc',
      email: 'prc@gmail.com',
      isMale: true,
      salary: 111.11
    }
  }
};

const deleteUserMutation = {
  query: `
    mutation {
      deleteUser(userId: 11)
    }
  `
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

const signInMutation = {
  query: `
    mutation($userName: String!, $password: String!) {
      signIn(userName: $userName, password: $password)
    }
  `,
  variables: {
    userName: 'alikadir',
    password: '123abc'
  }
};

let headers = {
  'Content-Type': 'application/json'
};

function callGraphqlApi(query) {
  // pure-client working with apollo-server
  // apollo-react-client working with pure-server
  fetch('http://localhost:2000/graphql', {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(query)
  })
    .then(result => result.json())
    .then(result => {
      if (!result.errors && result.data.signIn) headers['Authorization'] = `Bearer ${result.data.signIn}`;
      console.log('data returned:', JSON.stringify(result));
    })
    .catch(err => console.log(err))
    .finally(() => {
      recursiveQuestion();
    });
}

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const recursiveQuestion = () => {
  rl.question(
    `
============================================
 Which graphql operation do you want to run? 
   - signInMutation 
   - createUserMutation
   - updateUserMutation
   - deleteUserMutation
   - complexQuery
   - getUserError

   x - exit

`,
    answer => {
      if (answer == 'exit') {
        rl.close();
        return;
      }

      console.log('calling...');
      callGraphqlApi(eval(answer));
    }
  );
};

recursiveQuestion();
