import { gql } from 'apollo-server-express';

// String, Int, Float, Boolean, [], ID = String or Int
// String! is a non-nullable string.

export default gql`
  enum Status {
    new
    updated
    deleted
  }

  input UserInput {
    name: String
    userName: String
    nick: String
    email: String
    isMale: Boolean
    salary: Float
  }

  type Todo {
    id: Int
    userId: Int
    title: String
    completed: Boolean
    user: User
  }

  type User {
    id: Int
    name: String!
    userName: String @deprecated(reason: "You should use 'nick' instead of userName field")
    nick: String
    email: String @deprecated
    isMale: Boolean
    salary: Float
    posts: [Post]
    comments: [Comment]
    todos: [Todo]
  }

  type Comment {
    id: Int
    userId: Int
    postId: Int
    subject: String
    body: String
    createDate: String
    user: User
    post: Post
  }

  type Post {
    id: Int
    userId: Int!
    """
    title is describe to post custom description
    """
    title: String
    body: String
    status: Status
    user: User
    comments: [Comment]
  }

  type Query {
    posts: [Post]
    users: [User]
    comments: [Comment]
    todos: [Todo]
    singlePost(id: ID): Post
    userPosts(userId: ID): [Post]
    getPostsByStatus(status: Status): [Post]
    getUsersBetweenSalary(max: Float, min: Float, ascending: Boolean): [User]
    getUserExceptionThrow: [User]
  }

  type Mutation {
    divide(num1: Int, num2: Int): Float
    createUser(input: UserInput): User
    updateUser(userId: ID, input: UserInput): User
    deleteUser(userId: ID): Boolean
  }
`;
