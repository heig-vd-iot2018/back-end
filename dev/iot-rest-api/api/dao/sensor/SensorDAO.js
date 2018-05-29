const utils = require('../../helpers/utils');

/**
  DAO class for accessing Sensor object.
*/
class SensorDAO {
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

          const collection = db.collection('sensors');
          // Insert some documents
          collection.find().toArray((error, message) => {
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
}

module.exports = SensorDAO;
