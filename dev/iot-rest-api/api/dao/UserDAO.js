const utils = require('../helpers/utils');
const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserDAO {
  constructor(settings) {
    utils.assertRequiredProperties(
      settings,
      ['dbAddress', 'dbPort', 'dbName', 'mongoClient']
    );

    this.settings = settings;
  }

  create(user) {
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

          collection.findOne({ username: user.username }, (errorFinding, existingUser) => {
            if (errorFinding !== null) {
              reject(errorFinding);
            } else if (existingUser !== null) {
              reject(new Error('EXISTING_USER'));
            } else {
              // Insert some documents
              user.password = bcrypt.hashSync(user.password, saltRounds);

              collection.insertOne(user, (error, result) => {
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
          collection.findOne({ username }, (error, user) => {
            if (error !== null) {
              reject(error);
            } else {
              resolve(user);
            }
          });

          client.close();
        }
      });
    });
  }
}

module.exports = UserDAO;
