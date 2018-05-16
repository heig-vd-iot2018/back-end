const dbConfig = require('../../config/database');
const MessageDAO = require('./models/MessageDAO');

const database = {
  messageDAO: new MessageDAO({
    dbAddress: dbConfig.address,
    dbPort: dbConfig.port,
  }),
};

module.exports = database;
