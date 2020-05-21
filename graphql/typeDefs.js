const { gql } = require("apollo-server");

module.exports = gql`
  # Post Type
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
  }

  # User Type
  type User {
    id: ID!
    username: String!
    email: String!
    token: String!
    createdAt: String!
  }

  # Input Register Type
  input RegisterInput {
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  }
  # Login Type
  input LoginInput {
    username: String!
    password: String!
  }

  # Comment Type
  type Comment {
    id: ID!
    username: String!
    createdAt: String!
    body: String!
  }

  # Like Type
  type Like {
    id: ID!
    username: String!
    createdAt: String!
  }

  # Get All Post
  type Query {
    # sayHi: String!
    getPosts: [Post]
    getPost(postId: ID!): Post!
  }

  # Register New User and login
  type Mutation {
    register(registerInput: RegisterInput): User! # return User Type
    login(loginInput: LoginInput): User!
    createPost(body: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }
  # type Subscription {
  #   newPost: Post!
  # }
`;
