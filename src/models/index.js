/*jshint esversion: 6 */

//file Database --> scrap and convert to postrgreSQL at end:

let users = {
  1: {
    id: '1',
    username: 'otteb',
    email: 'briantron@gmail.com',
    password: "qwerty",
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'Amby',
    email: 'amby@gmail.com',
    password: "password",
    messageIds: [2],
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'By World',
    userId: '2',
  },
};

export default {
  users,
  messages,
};
