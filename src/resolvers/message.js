/*jshint esversion: 6 */
import uuidv4 from 'uuid/v4';

export default {
  Query: {
    messages: (parent, args, { models, me}) => {
      // console.log("CURRENT [me] USER: ",me);//testing
      if(!me){
        throw new Error("Not Authorized");
      }
      return Object.values(models.messages);
    },
    message: (parent, { id }, { models, me}) => {
      // console.log("CURRENT [me] USER: ",me);//testing
      if(!me){
        throw new Error("Not Authorized");
      }
      return models.messages[id];
    },
  },

  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      // console.log("CURRENT [me] USER: ",me);//testing
      if(!me){//check permissions:
        throw new Error("Not Authorized");
      }
      //provide unique password
      const id = uuidv4();
      //create message object:
      const message = {
        id,
        text,
        userId: me.id,
      };
      //add new message to temp DB:
      models.messages[id] = message;
      // console.log("NEW MESSAGE: ", message); //testing
      //add message to user's messages:
      models.users[me.id].messageIds.push(id);
      //return the message as confirmation:
      return message;
    },

    deleteMessage: (parent, { id }, { models }) => {
      // console.log("CURRENT [me] USER: ",me);//testing
      if(!me){//check permissions:
        throw new Error("Not Authorized");
      }
      //retrieve message:
      const { [id]: message, ...otherMessages } = models.messages;
      //check the message exists:
      if (!message) {
        return false;//Doesn't exist to delete:
      }
      //set temp DB to message list without deleted message:
      models.messages = otherMessages;
      //operation successful
      return true;
    },
  },

  Message: {
    user: (message, args, { models }) => {
      return models.users[message.userId];
    },
  },
};
