/**
  DAO instances using the database configuration.

  Exports the DAO objects to use to connect and operate CRUD operations
  on the database.
*/

const dbConfig = require('../../config/database');
const MessageDAO = require('./message/MessageDAO');
const SensorDAO = require('./sensor/SensorDAO');
const { MongoClient } = require('mongodb');

const database = {
  messageDAO: new MessageDAO({
    dbAddress: dbConfig.address,
    dbPort: dbConfig.port,
    dbName: dbConfig.name,
    mongoClient: MongoClient,
  }),
  sensorDAO: new SensorDAO({
    dbAddress: dbConfig.address,
    dbPort: dbConfig.port,
    dbName: dbConfig.name,
    mongoClient: MongoClient,
  }),
};

module.exports = database;
