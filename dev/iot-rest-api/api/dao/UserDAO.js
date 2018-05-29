const utils = require('../helpers/utils');

class UserDAO {
  constructor(settings) {
    utils.assertRequiredProperties(
      settings,
      ['dbAddress', 'dbPort', 'dbName', 'mongoClient']
    );

    this.settings = settings;
  }

  create(username, password, role) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    return new Promise((resolve, reject) => {
      mongoClient.connect(url, (err, client) => {
        if (err !== null) {
          reject(err);
        } else {
          const db = client.db(dbName);

          const collection = db.collection('users');
          // Insert some documents
          collection.insertOne({ username, password, role }, (error, result) => {
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

  findByUsername(username) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    return new Promise((resolve, reject) => {
      mongoClient.connect(url, (err, client) => {
        if (err !== null) {
          reject(err);
        } else {
          const db = client.db(dbName);

          const collection = db.collection('users');
          // Insert some documents
          collection.findOne({ username }, (error, message) => {
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

module.exports = UserDAO;
