const utils = require('../../helpers/utils');

/**
  DAO class for accessing Message object.
*/
class MessageDAO {
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
    Find a Message in the databse.
    @param name {string} - The name of the Message author
    @return {Promise object} - A promise to the Message object or null if not found
  */
  findOne(name) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    return new Promise((resolve, reject) => {
      mongoClient.connect(url, (err, client) => {
        if (err !== null) {
          reject(err);
        } else {
          const db = client.db(dbName);

          const collection = db.collection('messages');
          // Insert some documents
          collection.findOne({ name }, (error, message) => {
            if (error !== null) {
              reject(error);
            } else {
              resolve(message);
            }
          });

          client.close();
        }
      });
    });
  }

  /**
    Save a Message in the database
    @param message {Message object} - The Message model to save
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

          const collection = db.collection('messages');
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

module.exports = MessageDAO;
