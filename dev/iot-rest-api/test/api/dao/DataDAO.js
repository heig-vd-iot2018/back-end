const MongodbMemoryServer = require('mongodb-memory-server').default;
const should = require('should');
const DataDAO = require('../../../api/dao/DataDAO');
const Data = require('../../../api/models/Data');
const config = require('../../../config/database.js');
const { MongoClient } = require('mongodb');


let mongoServer;
let testDatabaseConfig;
let dataDAO;

describe('UserDAO', function describeMessageDAO() {
  // Here we set the timeout really high to allow to download the libs the first time
  this.timeout(120000);

  before(async (done) => {
    mongoServer = new MongodbMemoryServer(config);
    const port = await mongoServer.getPort();
    const dbHost = 'localhost';
    const dbName = await mongoServer.getDbName();

    // Create the testing database configuration
    testDatabaseConfig = {
      dbAddress: dbHost,
      dbPort: port,
      dbName,
      mongoClient: MongoClient,
    };
    // Finished Before
    done();
  });

  after((done) => {
    mongoServer.stop();
    done();
  });

  describe('constructor', () => {
    it('should throw an Error if the settings argument object is missing in the constructor', (done) => {
      (() => {
        dataDAO = new DataDAO();
      }).should.throw('Required object is undefined.');
      done();
    });

    it('should throw an Error if one of properties is missing in the settings argument object', (done) => {
      (() => {
        dataDAO = new DataDAO({});
      }).should.throw('Missing required property dbAddress.');
      (() => {
        dataDAO = new DataDAO({ dbAddress: '' });
      }).should.throw('Missing required property dbPort.');
      (() => {
        dataDAO = new DataDAO({ dbAddress: '', dbPort: 0 });
      }).should.throw('Missing required property dbName.');
      (() => {
        dataDAO = new DataDAO({ dbAddress: '', dbPort: 0, dbName: '' });
      }).should.throw('Missing required property mongoClient.');
      done();
    });

    it('should not throw an Error if the required settings are provided as argument', (done) => {
      (() => {
        dataDAO = new DataDAO(testDatabaseConfig);
      }).should.not.throw();
      done();
    });
  });

  describe('save()', () => {
    this.timeout(2000); // Set the timeout back to normal
    it('should return a Promise', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      const p = dataDAO.save(new Data('sensoreId', Date.now(), 'temperature', 23.3));
      p.should.be.a.Promise();
      p.then(
        () => { done(); },
        () => { done(new Error('The Promise was rejected')); }
      );
    });

    it('should reject the Promise if the date or the sensorId or the type fields are not defined', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      dataDAO.save(new Data(undefined, Date.now(), 'temperature', 23.3))
        .should.be.rejected()
        .then(() => dataDAO.save(new Data(undefined, undefined, 'temperature', 23.3))
          .should.be.rejected())
        .then(() => dataDAO.save(new Data('SensorId', undefined, 'temperature', 23.3))
          .should.be.rejected())
        .then(() => dataDAO.save(new Data('SensorId', Date.now(), undefined, 23.3))
          .should.be.rejected())
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should resolve the Promise if the fields are correct', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      dataDAO.save(new Data('SensorId', Date.now(), 'temperature', 23.3))
        .should.be.fulfilled()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should resolve the saved Data if the fields are correct', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      const expected = new Data('SensorId', Date.now(), 'temperature', 23.3);
      dataDAO.save(expected)
        .should.be.fulfilled()
        .then((created) => {
          try {
            created.sensorId.should.deepEqual(expected.sensorId);
            created.date.should.deepEqual(expected.date);
            created.type.should.deepEqual(expected.type);
            should.deepEqual(created.value, expected.value);
            done();
          } catch (err) {
            done(err);
          }
        }).catch((err) => {
          done(err);
        });
    });
  });
});
