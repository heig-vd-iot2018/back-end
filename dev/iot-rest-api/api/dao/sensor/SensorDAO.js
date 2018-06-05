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

  /**
    Find a Sensor in the databse.
    @param id {string} - The name of the Sensor
    @return {Promise object} - A promise to the Sensor object or null if not found
  */
  findOne(id) {
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
          collection.findOne({ id }, (error, message) => {
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
    Update a Sensor in the databse.
    @param id {string} - The name of the Sensor to update
    @return {Promise object} - A promise to the Sensor object or null if not found
  */
  updateOne(id, sensor) {
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
          collection.updateOne(
            { "id" : id },
            { $set: { 
              "documentationLink": sensor.documentationLink,
              "dateCreated": sensor.dateCreated,
              "dateUpdated": sensor.dateUpdated,
              "active": sensor.active,
              "refreshInterval": sensor.refreshInterval,
              "encoding": sensor.encoding,
              "values": sensor.values,
            } }, 
    
            (error, message) => {
              if (error !== null) {
                reject(error);
              } else {
                resolve(message);
              }
            }
          );

          client.close();
        }
      });
    });
  }
}

module.exports = SensorDAO;
