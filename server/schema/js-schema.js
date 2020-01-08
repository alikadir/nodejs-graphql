import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLID,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInputObjectType
} from 'graphql';
import fetch from 'node-fetch';
import fs from 'fs';
import jwt from 'jsonwebtoken';

import { checkAuth, ROLE } from '../utilities/authentication';
import { fieldMapResolver } from '../utilities/graphql-utility';

import adminJson from '../data/admins.json';
import commentJson from '../data/comments.json';
import postJson from '../data/posts.json';
import userJson from '../data/users.json';

// !! build in directives which are skip, include aren't using in javascript schema
// only deprecated directive using as deprecationReason in javascript schema

const StatusType = new GraphQLEnumType({
  name: 'Status',
  values: {
    New: { value: 'new' },
    Updated: { value: 'updated' },
    Deleted: { value: 'deleted' }
  }
});

const TodoType = new GraphQLObjectType({
  name: 'Todo',
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    title: { type: GraphQLString },
    completed: { type: GraphQLBoolean },
    user: {
      type: UserType,
      resolve(parent, args, context, info) {
        return userJson.find(x => x.id == parent.userId);
      }
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLInt },
    name: { type: new GraphQLNonNull(GraphQLString) },
    userName: { type: GraphQLString, deprecationReason: 'You should use "nick" instead of userName field' },
    nick: { type: GraphQLString },
    email: { type: GraphQLString, deprecationReason: ' ' },

    isMale: { type: GraphQLBoolean },
    salary: { type: GraphQLFloat },
    posts: {
      type: GraphQLList(PostType),
      resolve(parent, args, context, info) {
        return postJson.filter(x => x.userId == parent.id);
      }
    },
    comments: {
      type: GraphQLList(CommentType),
      resolve(parent, args, context, info) {
        return comment.filter(x => x.userId == parent.id);
      }
    },
    todos: {
      type: GraphQLList(TodoType),
      async resolve(parent, args, context, info) {
        return await (await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${parent.id}`)).json();
      }
    }
  })
});

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: GraphQLInt },
    PostId: { type: GraphQLInt },
    subject: { type: GraphQLString },
    body: { type: GraphQLString },
    post: {
      type: PostType,
      resolve(parent, args, context, info) {
        return postJson.find(x => x.id == parent.PostId);
      }
    },
    user: {
      type: UserType,
      resolve(parent, args, context, info) {
        return userJson.find(x => x.id == parent.userId);
      }
    }
  })
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLInt },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: GraphQLString, description: 'title is describe to post custom description' },
    body: { type: GraphQLString },
    status: { type: StatusType },
    user: {
      type: UserType,
      resolve(parent, args, context, info) {
        return userJson.find(x => x.id == parent.userId);
      }
    },
    comments: {
      type: GraphQLList(CommentType),
      resolve(parent, args, context, info) {
        return commentJson.filter(x => x.postId == parent.id);
      }
    }
  })
});

const UserInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    name: { type: GraphQLString },
    userName: { type: GraphQLString },
    nick: { type: GraphQLString },
    email: { type: GraphQLString },
    isMale: { type: GraphQLBoolean },
    salary: { type: GraphQLFloat }
  }
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      posts: {
        type: GraphQLList(PostType),
        resolve: (parent, args, context, info) => {
          return postJson;
        }
      },
      todos: {
        type: GraphQLList(TodoType),
        async resolve(parent, args, context, info) {
          return await (await fetch('https://jsonplaceholder.typicode.com/todos')).json();
        }
      },
      users: {
        type: GraphQLList(UserType),
        resolve(parent, args, context, info) {
          console.log(fieldMapResolver(info.fieldNodes[0]));
          console.log(context.isMobile);
          return userJson;
        }
      },
      singlePost: {
        type: PostType,
        args: { id: { type: GraphQLID } },
        resolve(parent, args, context, info) {
          return postJson.find(x => x.id == args.id);
        }
      },
      userPosts: {
        type: GraphQLList(PostType),
        args: { userId: { type: GraphQLID } },
        resolve(parent, args, context, info) {
          return postJson.filter(x => x.userId == args.userId);
        }
      },
      getPostsByStatus: {
        type: GraphQLList(PostType),
        args: {
          status: { type: StatusType }
        },
        resolve(parent, args, context, info) {
          return postJson.filter(x => x.status == args.status);
        }
      },
      getUsersBetweenSalary: {
        type: GraphQLList(UserType),
        args: {
          max: { type: GraphQLFloat },
          min: { type: GraphQLFloat },
          ascending: { type: GraphQLBoolean }
        },
        resolve(parent, args, context, info) {
          return userJson
            .filter(x => x.salary > args.min && x.salary < args.max)
            .sort((a, b) => (args.ascending ? a.salary - b.salary : b.salary - a.salary));
        }
      },
      getUserExceptionThrow: {
        type: GraphQLList(UserType),
        resolve(parent, args, context, info) {
          return args.aaa.bbb.ccc;
          // return 200 http code and there is "errors" field in result json
          // there is also other query field's "data" in result json
        }
      }
    }
  }),
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      divide: {
        type: GraphQLFloat,
        args: {
          num1: { type: GraphQLFloat },
          num2: { type: GraphQLFloat }
        },
        resolve(parent, args, context, info) {
          return args.num1 / args.num2;
        }
      },
      createUser: {
        type: UserType,
        args: {
          input: { type: UserInputType }
        },
        resolve: checkAuth(ROLE.SUPER_ADMIN)(async (parent, args, context, info) => {
          let id = userJson.sort((a, b) => b.id - a.id)[0].id;
          args.input.id = id + 1;

          userJson.push(args.input);
          let json = JSON.stringify(userJson);
          await fs.writeFileSync('./data/users.json', json);

          console.log(`Admin ${context.admin.userName} created user!`);

          return args.input;
        })
      },
      updateUser: {
        type: UserType,
        args: {
          userId: { type: GraphQLID },
          input: { type: UserInputType }
        },
        resolve: checkAuth(ROLE.ADMIN)(async (parent, args, context, info) => {
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

            console.log(`Admin ${context.admin.userName} updated user!`);

            return user;
          } else throw new Error('User not found.');
        })
      },
      deleteUser: {
        type: GraphQLBoolean,
        args: {
          userId: { type: GraphQLID }
        },
        resolve: checkAuth(ROLE.ADMIN)(async (parent, args, context, info) => {
          let user = userJson.find(x => x.id == args.userId);
          if (!user) throw new Error('User not found.');

          let index = userJson.indexOf(user);
          userJson.splice(index, 1);
          let json = JSON.stringify(userJson);
          await fs.writeFileSync('./data/users.json', json);

          console.log(`Admin ${context.admin.userName} deleted user!`);

          return true;
        })
      },
      signIn: {
        type: GraphQLString,
        args: {
          userName: { type: new GraphQLNonNull(GraphQLString) },
          password: { type: new GraphQLNonNull(GraphQLString) }
        },
        async resolve(parent, args, context, info) {
          const admin = adminJson.find(x => x.userName == args.userName && x.password == args.password);
          if (admin) {
            // generate JWT and return token string
            return jwt.sign(admin, 'AKB_SecretKey', { expiresIn: '30s' });
          } else {
            throw new Error('User does not exists!');
          }
        }
      }
    }
  })
});
