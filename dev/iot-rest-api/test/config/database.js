// Configuration for the test database
const TEST_DATABASE_CONFIG = {
  instance: {
    dbName: 'iot_back_end',
    port: process.env.DB_PORT,
  },
  binary: {
    downloadDir: './.mongodb-binaries',
  },
};

module.exports = TEST_DATABASE_CONFIG;
