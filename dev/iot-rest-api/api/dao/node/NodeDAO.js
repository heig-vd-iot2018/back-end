const utils = require('../../helpers/utils');

/**
  DAO class for accessing Sensor object.
*/
class NodeDAO {
  /**
    @constructor
    @param settings {object} - The settings required to access the database
  */
  constructor(settings) {
    utils.assertRequiredProperties(
      settings,
      ['dbAddress', 'dbPort', 'dbName', 'mongoClient']
    );

    this.settings = settings;
  }

  /**
    Find all Sensor in the databse.
    @return {Promise object} - A promise to the list of Sensor object or null if not found
  */
  findAll() {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    return new Promise((resolve, reject) => {
      mongoClient.connect(url, (err, client) => {
        if (err !== null) {
          reject(err);
        } else {
          const db = client.db(dbName);

          const collection = db.collection('nodes');

          collection.find().toArray((error, nodes) => {
            console.log('IN NodeDAO, trying to find all');
            console.log(nodes);
            if (error !== null) {
              reject(error);
            } else {
              resolve(nodes);
            }
          });

          client.close();
        }
      });
    });
  }

  /**
    Save a Node in the database
    @param message {Node object} - The Node model to save
    @return {Promise object} - Success or error
  */
  saveOne(message) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    return new Promise((resolve, reject) => {
      mongoClient.connect(url, (err, client) => {
        if (err !== null) {
          reject(err);
        } else {
          const db = client.db(dbName);

          const collection = db.collection('nodes');
          // Insert some documents
          collection.insertOne(message, (error, result) => {
            if (error !== null) {
              reject(error);
            } else if (result.insertedCount !== 1) {
              reject(error);
            } else {
              resolve(result.ops[0]);
            }
          });

          client.close();
        }
      });
    });
  }
}

module.exports = NodeDAO;
