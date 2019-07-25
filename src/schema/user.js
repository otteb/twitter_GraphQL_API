/*jshint esversion: 6 */
import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    #fetches all users (FOR TESTING PURPOSES ONLY - DELETE FOR PRODUCTION)
    users: [User!]
    #fetches single user (FOR TESTING PURPOSES ONLY - DELETE FOR PRODUCTION)
    user(id: ID!): User
    #returns information of current user
    me: User!
    getUserMessages: [Message!]
  }

  extend type Mutation {
    #Creates new user - DOES NOT automatically log them in.
    register(username: String!, email: String!, password: String!): User!
    #Login checks against DB and provides jsonwebtoken to be put in header:
    login(email: String!, password: String!): String!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    # IMPORTANT: the password is included in the schema for testing purposes
    # only it would need to be removed for production.
    password: String!
    messages: [Message!]
  }
`;
