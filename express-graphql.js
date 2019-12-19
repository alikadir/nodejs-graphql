import express from 'express'
import graphqlHTTP from 'express-graphql'
import { buildSchema } from 'graphql';


var schema = buildSchema(`
  type Query {
    name: String,
    id: Int,
    age: Int,
    isMale: Boolean
  }
`);

var root = {
  name: () => 'Ali Kadir',
  id: 2,
  age: 34,
  isMale: true
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));