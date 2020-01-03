import fetch from 'node-fetch';
import fs from 'fs';

import { fieldMapResolver } from '../utilities/graphql-utility';

import commentJson from '../data/comments.json';
import postJson from '../data/posts.json';
import userJson from '../data/users.json';

// mutation is delete, update, create
// query is only select, that even to be a function

export default {
  Query: {
    posts: (parent, args, context, info) => postJson,
    users: (parent, args, context, info) => {
      console.log(fieldMapResolver(info.fieldNodes[0]));
      console.log(context.isMobile);
      return userJson;
    },
    comments: (parent, args, context, info) => commentJson,
    todos: async (parent, args, context, info) => await (await fetch('https://jsonplaceholder.typicode.com/todos')).json(),
    singlePost: (parent, args, context, info) => postJson.find(x => x.id == args.id),
    userPosts: (parent, args, context, info) => postJson.filter(x => x.userId == args.userId),
    getPostsByStatus: (parent, args, context, info) => postJson.filter(x => x.status == args.status),
    getUsersBetweenSalary: (parent, args, context, info) =>
      userJson
        .filter(x => x.salary > args.min && x.salary < args.max)
        .sort((a, b) => (args.ascending ? a.salary - b.salary : b.salary - a.salary)),
    getUserExceptionThrow: (parent, args, context, info) => {
      return args.aaa.bbb.ccc;
      // return 200 http code and there is "errors" field in result json
      // there is also other query field's "data" in result json
    }
  },
  User: {
    posts: (parent, args, context, info) => postJson.filter(x => x.userId == parent.id),
    comments: (parent, args, context, info) => commentJson.filter(x => x.userId == parent.id),
    todos: async (parent, args, context, info) =>
      await (await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${parent.id}`)).json()
  },
  Post: {
    user: (parent, args, context, info) => userJson.find(x => x.id == parent.userId),
    comments: (parent, args, context, info) => commentJson.filter(x => x.postId == parent.id)
  },
  Comment: {
    user: (parent, args, context, info) => userJson.find(x => x.id == parent.userId),
    post: (parent, args, context, info) => postJson.find(x => x.id == parent.postId)
  },
  Mutation: {
    divide: (parent, args, context, info) => args.num1 / args.num2,
    createUser: async (parent, args, context, info) => {
      let id = userJson.sort((a, b) => b.id - a.id)[0].id;
      args.input.id = id + 1;

      userJson.push(args.input);
      let json = JSON.stringify(userJson);
      await fs.writeFileSync('../data/users.json', json);

      return args.input;
    },
    updateUser: async (parent, args, context, info) => {
      let user = userJson.find(x => x.id == args.userId);
      if (user) {
        // item changed by reference type in userJson
        for (const field in user) {
          user[field] = args.input[field];
        }
        user.id = args.userId;

        /*  user = {
            id: args.userId,
            ...args.input
          }; */

        let json = JSON.stringify(userJson);
        await fs.writeFileSync('./data/users.json', json);

        return user;
      } else throw 'user not found';
    },
    deleteUser: async (parent, args, context, info) => {
      let user = userJson.find(x => x.id == args.userId);
      let index = userJson.indexOf(user);
      userJson.splice(index, 1);
      let json = JSON.stringify(userJson);
      await fs.writeFileSync('./data/users.json', json);

      return true;
    }
  }
};
