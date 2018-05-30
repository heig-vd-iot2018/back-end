const MongodbMemoryServer = require('mongodb-memory-server').default;
const should = require('should');
const SensorDAO = require('../../../../api/dao/sensor/SensorDAO');
const Sensor = require('../../../../api/models/Sensor');
const config = require('../../../config/database.js');
const { MongoClient } = require('mongodb');

let mongoServer;
let testDatabaseConfig;
let sensorDAO;

describe('SensorDAO', function describeSensorDAO() {
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
        sensorDAO = new SensorDAO();
      }).should.throw('Required object is undefined.');
      done();
    });

    it('should throw an Error if one of properties is missing in the settings argument object', (done) => {
      (() => {
        sensorDAO = new SensorDAO({});
      }).should.throw('Missing required property dbAddress.');
      (() => {
        sensorDAO = new SensorDAO({ dbAddress: '' });
      }).should.throw('Missing required property dbPort.');
      (() => {
        sensorDAO = new SensorDAO({ dbAddress: '', dbPort: 0 });
      }).should.throw('Missing required property dbName.');
      (() => {
        sensorDAO = new SensorDAO({ dbAddress: '', dbPort: 0, dbName: '' });
      }).should.throw('Missing required property mongoClient.');
      done();
    });

    it('should not throw an Error if the required settings are provided as argument', (done) => {
      (() => {
        sensorDAO = new SensorDAO(testDatabaseConfig);
      }).should.not.throw();
      done();
    });
  });

  describe('findOne()', () => {
    it('should return a Promise.', (done) => {
      sensorDAO = new SensorDAO(testDatabaseConfig);
      const p = sensorDAO.findOne('');
      p.should.be.a.Promise();
      p.then(
        () => { done(); },
        () => { done(new Error('The Promise was rejected')); }
      );
    });

    it('should reject the returned Promise if it cannot connect to the database', (done) => {
      const falseConfig = {
        dbAddress: 'localhost',
        dbPort: 0,
        dbName: 'falseDBName',
        mongoClient: MongoClient,
      };
      sensorDAO = new SensorDAO(falseConfig);
      sensorDAO.findOne('')
        .should.be.rejected()
        .then(() => {
          done();
        });
    });

    it('should return null if it cannot find an sensor in the database', (done) => {
      const { mongoClient } = testDatabaseConfig;
      const { dbName } = testDatabaseConfig;
      const url = `mongodb://${testDatabaseConfig.dbAddress}:${testDatabaseConfig.dbPort}`;

      mongoClient.connect(url, (err, client) => {
        const db = client.db(dbName);
        const collection = db.collection('sensors');

        // Insert some documents
        const json = new Sensor(
          'mySensor',
          'www.google.ch',
          new Date(),
          new Date(),
          true,
          60,
          'utf-8',
          ['a', 'b']
        );

        collection.insertOne(json);

        sensorDAO = new SensorDAO(testDatabaseConfig);

        sensorDAO.findOne('').then((sensor) => {
          try {
            should.not.exist(sensor);
            done();
          } catch (error) {
            done(error);
          }
        });

        client.close();
      });
    });
  });
});
