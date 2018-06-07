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
            if (error !== null) {
              reject(error);
              client.close();
            } else {
              resolve(nodes);
              client.close();
            }
          });
        }
      });
    });
  }

  /**
    Find a Message in the databse.
    @param id {integer} - The ID of the Node to get
    @return {Promise object} - A promise to the Message object or null if not found
  */
  findById(id) {
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
          collection.findOne({ id }, (error, message) => {
            if (error !== null) {
              reject(error);
            } else {
              resolve(message);
            }
          });
        }

        client.close();
      });
    });
  }

  /**
    Save a Node in the database
    @param message {Node object} - The Node model to save
    @return {Promise object} - Success or error
  */
  saveOne(node) {
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
          collection.insertOne(node, (error, result) => {
            if (error !== null) {
              reject(error);
            } else if (result.insertedCount !== 1) {
              reject(error);
            } else {
              resolve(result.ops[0]);
            }
          });
        }

        client.close();
      });
    });
  }
}

module.exports = NodeDAO;
