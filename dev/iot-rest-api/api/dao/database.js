/**
 DAO instances using the database configuration.

 Exports the DAO objects to use to connect and operate CRUD operations
 on the database.
 */

const dbConfig = require('../../config/database');

const NodeDAO = require('./node/NodeDAO');
const SensorDAO = require('./sensor/SensorDAO');
const UserDAO = require('./UserDAO');
const BlacklistedTokenDAO = require('./BlacklistedTokenDAO');
const DataDAO = require('./DataDAO');

const { MongoClient } = require('mongodb');

const database = {
  nodeDAO: new NodeDAO({
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

  userDAO: new UserDAO({
    dbAddress: dbConfig.address,
    dbPort: dbConfig.port,
    dbName: dbConfig.name,
    mongoClient: MongoClient,
  }),

  blacklistedTokenDAO: new BlacklistedTokenDAO({
    dbAddress: dbConfig.address,
    dbPort: dbConfig.port,
    dbName: dbConfig.name,
    mongoClient: MongoClient,
  }),
  dataDAO: new DataDAO({
    dbAddress: dbConfig.address,
    dbPort: dbConfig.port,
    dbName: dbConfig.name,
    mongoClient: MongoClient,
  }),
};

module.exports = database;
