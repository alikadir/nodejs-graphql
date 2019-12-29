import { createComplexityLimitRule } from 'graphql-validation-complexity';
import express from 'express';
import graphqlHTTP from 'express-graphql';

import externalSchema from './schema/js-schema';

var app = express();

app.use(
  '/graphql',
  graphqlHTTP((req, res, params) => ({
    schema: externalSchema,
    graphiql: true,
    context: {
      // added isMobile field to context object
      isMobile: req.headers['user-agent'].includes('iphone'),
      req,
      res
    },
    validationRules: [createComplexityLimitRule(5000)] // default 1000
  }))
);

app.listen(3000, () => console.log(' 🚀 Now browse to http://localhost:3000/graphql'));
