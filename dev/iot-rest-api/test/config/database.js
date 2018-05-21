// Configuration for the test database
const TEST_DATABASE_CONFIG = {
  instance: {
    dbName: 'iot_back_end_test',
  },
  binary: {
    downloadDir: './.mongodb-binaries',
  },
};

module.exports = TEST_DATABASE_CONFIG;
