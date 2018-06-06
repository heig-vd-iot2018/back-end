const utils = require('../helpers/utils');

class DataDAO {
  constructor(settings) {
    utils.assertRequiredProperties(
      settings,
      ['dbAddress', 'dbPort', 'dbName', 'mongoClient']
    );
    this.settings = settings;
  }

  save(data) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    return new Promise((resolve, reject) => {
      if (data.sensorId === undefined || data.sensorId === null) {
        reject(new Error('sensorId field cannot be undefined or null when saving a Data object'));
        return;
      } else if (data.date === undefined || data.date === null) {
        reject(new Error('date field cannot be undefined or null when saving a Data object.'));
        return;
      } else if (data.type === undefined || data.type === null) {
        reject(new Error('type field cannot be undefined or null when saving a Data object.'));
        return;
      }

      mongoClient.connect(url, (err, client) => {
        if (err !== null) {
          reject(err);
        } else {
          const db = client.db(dbName);

          const collection = db.collection('data');
          // Insert some documents
          collection.insertOne(data, (error, result) => {
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

  findBySensorId(id) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    return new Promise((resolve, reject) => {
      mongoClient.connect(url, (err, client) => {
        if (err !== null) {
          reject(err);
        } else {
          const db = client.db(dbName);

          const collection = db.collection('data');
          // Insert some documents
          collection.find({ sensorId: id }).toArray((error, datas) => {
            if (error !== null) {
              reject(error);
            } else {
              resolve(datas);
            }
          });

          client.close();
        }
      });
    });
  }
}

module.exports = DataDAO;
