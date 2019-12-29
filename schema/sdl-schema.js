import { gql } from 'apollo-server-express';

// String, Int, Float, Boolean, [], ID = String or Int
// String! is a non-nullable string.

export default gql`
  enum Status {
    new
    updated
    deleted
  }

  type User {
    id: Int
    name: String!
    userName: String @deprecated(reason: "You should use 'nick' instead of userName field")
    nick: String
    email: String
    isMale: Boolean
    salary: Float
    posts: [Post]
    comments: [Comment]
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
    singlePost(id: ID): Post
    userPosts(userId: ID): [Post]
    getPostsByStatus(status: Status): [Post]
    getUsersBetweenSalary(max: Float, min: Float): [User]
  }

  type Mutation {
    sum(num1: Int, num2: Int): Float
  }
`;
