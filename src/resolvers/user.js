/*jshint esversion: 6 */
import uuidv4 from 'uuid/v4';
import models from '../models';
import bcrypt from 'bcrypt'; //don't do anything with this for now --> extra at end of project:
import jwt from 'jsonwebtoken';
import _ from 'lodash';


const createToken = (user) => {
  return 0;
};

export default {
  Query: {
    users: (parent, args, { models, me }) => {
      // console.log("CURRENT [me] USER: ",me);
      if(!me){
        throw new Error("Not Authorized");
      }
      return Object.values(models.users);
    },
    user: (parent, { id }, { models, me}) => {
      // console.log("CURRENT [me] USER: ",me);
      if(!me){
        throw new Error("Not Authorized");
      }

      return models.users[id];
    },
    me: (parent, args, { me }) => {
      // console.log("CURRENT [me] USER: ",me);
      if(!me){
        throw new Error("Not Authorized");
      }
      return me;
    },
    //retrieves messages for the current authenicated user:
    getUserMessages: (parent, args, { me }) =>{
      // console.log("CURRENT [me] USER: ",me);
      if(!me){
        throw new Error("Not Authorized");
      }
      // return Object.values(models.messages);
      return Object.values(models.messages).filter(
        message => message.userId === me.id
      );
    },
  },

  Mutation: {
    //register new User:
    register: (parent, { username, email, password }, { models }) => {
      //generate unique ID:
      const id = uuidv4();
      //assemble new user:
      const new_user = {
        id,
        username,
        email,
        password,
      };
      //add new user to data file:
      models.users[id] = new_user;
      return new_user;
    },

    //login user: Needs async due to jsonwebtoken operations
    login: async (parent, { email, password }, { models, SECRET }) => {
      //find the user by email:
      const result = Object.values(models.users).filter(
        user => user.email === email
      );
      //check that it is the only email:
      if(result.length != 1){
        throw "email incorrect";
      }
      //check the user's password:
      if(password != result[0].password){
        throw "incorrect password";
      }

      //correct login information --> generate webtoken:
      const token = await jwt.sign(
        {
          user: _.pick(result[0], ['id', 'username']),
        },
        SECRET,
        {
          expiresIn: '1y',
        }
      );

      return token;
    },
  },

  Message: {
    user: (message, args, { models }) => {
      return models.users[message.userId];
    },
  },
};
