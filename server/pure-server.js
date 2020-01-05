import { createComplexityLimitRule } from 'graphql-validation-complexity';
import cors from 'cors';
import express from 'express';
import graphqlHTTP from 'express-graphql';

import externalSchema from './schema/js-schema';

var app = express();

app.use(cors());

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

app.listen(1000, () => console.log('🚀 Now browse to http://localhost:1000/graphql'));
