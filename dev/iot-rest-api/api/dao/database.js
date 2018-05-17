const dbConfig = require('../../config/database');
const MessageDAO = require('./models/MessageDAO');
const { MongoClient } = require('mongodb');

const database = {
  messageDAO: new MessageDAO({
    dbAddress: dbConfig.address,
    dbPort: dbConfig.port,
    dbName: dbConfig.name,
    mongoClient: MongoClient,
  }),
};

module.exports = database;
