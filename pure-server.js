import express from 'express';

import graphqlHTTP from 'express-graphql';
import externalSchema from './schema/basic-schema';
var app = express();

//#region Build Schema
import postJson from './data/posts.json';

import { buildSchema } from 'graphql';
var schema = buildSchema(`	
  type post {	
    id: Int
    userId: Int!	
    """
    title is describe to post gql
    """
    title: String	
    body: String	
  }	
  type Query {
    posts: [post]
    singlePost(id: Int): post
    userPosts(userId: Int): [post]
  }
`);
var root = {
  posts: () => postJson,
  singlePost: args => postJson.find(x => x.id == args.id),
  userPosts: args => postJson.filter(x => x.userId == args.userId)
};
app.use('/graphql-gql', graphqlHTTP({ schema: schema, rootValue: root, graphiql: true }));
//#endregion

app.use('/graphql-js', graphqlHTTP({ schema: externalSchema, graphiql: true }));

app.listen(4000, () => console.log('Now browse to http://localhost:4000/graphql'));
