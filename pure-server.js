import express from 'express';

import graphqlHTTP from 'express-graphql';
import externalSchema from './schema/basic-schema';
var app = express();

//#region Build Schema with SDL (Schema Definition Language)
import postJson from './data/posts.json';

import { buildSchema } from 'graphql';
var schema = buildSchema(`	
enum Status {
    new
    updated
    deleted
  } 
type Post {	
    id: Int
    userId: Int!	
    """
    title is describe to post gql
    """
    title: String	
    body: String
    status: Status    
  }	
type Query {
    posts: [Post]
    singlePost(id: Int): Post
    userPosts(userId: Int): [Post]
    getPostsByStatus(status: Status): [Post]
  }
`);
var root = {
  posts: () => postJson,
  singlePost: args => postJson.find(x => x.id == args.id),
  userPosts: args => postJson.filter(x => x.userId == args.userId),
  getPostsByStatus: args => postJson.filter(x => x.status == args.status)
};
app.use('/graphql-sdl', graphqlHTTP({ schema: schema, rootValue: root, graphiql: true }));
//#endregion

app.use('/graphql-js', graphqlHTTP({ schema: externalSchema, graphiql: true }));

app.listen(4000, () => console.log('Now browse to http://localhost:4000/graphql'));
