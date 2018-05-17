const utils = require('../../helpers/utils');

class MessageDAO {
  constructor(settings) {
    utils.assertRequiredProperties(
      settings,
      ['dbAddress', 'dbPort', 'dbName', 'mongoClient']
    );

    this.settings = settings;
  }

  findOne(name, onSuccess, onError) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    mongoClient.connect(url, (err, client) => {
      if (err !== null) {
        onError(err);
      } else {
        const db = client.db(dbName);

        const collection = db.collection('messages');
        // Insert some documents
        collection.findOne({ name }, (error, message) => {
          if (error !== null) {
            onError(error);
          } else {
            onSuccess(message);
          }
        });

        client.close();
      }
    });
  }

  saveOne(message, onSuccess, onError) {
    const { mongoClient } = this.settings;
    const { dbName } = this.settings;
    const url = `mongodb://${this.settings.dbAddress}:${this.settings.dbPort}`;

    mongoClient.connect(url, (err, client) => {
      if (err !== null) {
        onError(err);
      } else {
        const db = client.db(dbName);

        const collection = db.collection('messages');
        // Insert some documents
        collection.insertOne(message, (error, result) => {
          if (error !== null) {
            onError(error);
          } else if (result.insertedCount !== 1) {
            onError(error);
          } else {
            onSuccess(result.ops[0]);
          }
        });

        client.close();
      }
    });
  }
}

module.exports = MessageDAO;
