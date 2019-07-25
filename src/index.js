/*jshint esversion: 6 */
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import schema from './schema';
import resolvers from './resolvers';
import models from './models';

const SECRET = "mySuperSecretSecret"; //NOT SAFE - DO NOT PUSH TO PRODUCTION

const app = express();

//adds User to current session if authorized:
const addUser = async (req) => {
  const token = req.headers.authorization;
  try {
    const user = await jwt.verify(token, SECRET);
    // console.log("USER: ", user);
    req.user = Object.values(models.users).filter(
      iter_user => user.user.id === iter_user.id
    )[0];//will only return 1 profile in array
    // console.log("REQ.USER: ", req.user);
  } catch (err) {
    // console.log(err); //uncomment if server seems unresponsive
  }
  req.next();
};

app.use(cors());
app.use(addUser);

//place authentication here!
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async (req) => {
    const current_user = req.req.user;
      return {
        me: current_user,
        SECRET,
        models,
      };
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  console.log('Apollo Server on http://localhost:8000/graphql');
});
