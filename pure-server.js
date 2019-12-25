import express from 'express';

import graphqlHTTP from 'express-graphql';
import externalSchema from './schema/basic-schema';
var app = express();

app.use('/graphql', graphqlHTTP({ schema: externalSchema, graphiql: true }));

app.listen(3000, () =>
  console.log('Now browse to http://localhost:3000/graphql')
);
