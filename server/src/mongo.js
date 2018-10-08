// TODO
const MONGO_HOST = 'localhost';
const MONGO_PORT = '27017';
const MONGO_USER = 'client';
const MONGO_PASSWORD = 'qwerty';
const MONGO_DATABASE = 'queue';

const mongoose = require('mongoose');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;

let db;

const connect = () => {
  // Use connect method to connect to the server
  return mongoose.connect(url)
    .then((client) => {
      console.log('MongoDB connection established');
      db = client.connection;
      return db;
    }); // TODO: catch & kill
};

module.exports = {
  connect,
  getConnection: () => db,
};
