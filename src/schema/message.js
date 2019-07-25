/*jshint esversion: 6 */
import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    #retrieves all message objects in DB (FOR TESTING ONLY)
    messages: [Message!]!
    #retrieves a specific message from messageId (FOR TESTING ONLY)
    message(id: ID!): Message!
  }

  extend type Mutation {
    #creates message from current logged-in user
    createMessage(text: String!): Message!
    #deletes message and returns action success status
    deleteMessage(id: ID!): Boolean!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;
