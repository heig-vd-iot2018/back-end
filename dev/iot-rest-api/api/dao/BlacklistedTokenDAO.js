const utils = require('../helpers/utils');

class BlacklistedTokenDAO {
  constructor(settings) {
    utils.assertRequiredProperties(
      settings,
      ['dbAddress', 'dbPort', 'dbName', 'mongoClient']
    );

    this.settings = settings;
  }

  create(blacklistedToken) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    return new Promise((resolve, reject) => {
      mongoClient.connect(url, (err, client) => {
        if (err !== null) {
          reject(err);
        } else {
          const db = client.db(dbName);

          const collection = db.collection('blacklistedtokens');
          // Insert some documents
          collection.insertOne({ blacklistedToken }, (error, result) => {
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

  find(blacklistedToken) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    return new Promise((resolve, reject) => {
      mongoClient.connect(url, (err, client) => {
        if (err !== null) {
          reject(err);
        } else {
          const db = client.db(dbName);

          const collection = db.collection('blacklistedtokens');
          // fond some documents
          collection.findOne({ blacklistedToken }, (error, token) => {
            if (error !== null) {
              reject(error);
            } else {
              resolve(token);
            }
          });

          client.close();
        }
      });
    });
  }
}

module.exports = BlacklistedTokenDAO;
