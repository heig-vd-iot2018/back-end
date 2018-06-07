const MongodbMemoryServer = require('mongodb-memory-server').default;
const should = require('should');
const DataDAO = require('../../../api/dao/DataDAO');
const Data = require('../../../api/models/Data');
const config = require('../../../config/database.js');
const { MongoClient } = require('mongodb');


let mongoServer;
let testDatabaseConfig;
let dataDAO;

describe('DataDAO', function describeMessageDAO() {
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

  beforeEach((done) => {
    const { mongoClient } = testDatabaseConfig;
    const url = `mongodb://${testDatabaseConfig.dbAddress}:${testDatabaseConfig.dbPort}`;
    mongoClient.connect(url, (err, client) => {
      if (err !== null) {
        done(err);
      } else {
        const db = client.db(testDatabaseConfig.dbName);
        const collection = db.collection('data');
        // Insert some documents
        collection.deleteMany({}, (error) => {
          if (error !== null) {
            done(error);
          } else {
            done();
          }
        });
        client.close();
      }
    });
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
        () => { done(); }
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

  describe('saveAll', () => {
    it('should return a Primise', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      const p = dataDAO.saveAll([]);
      p.should.be.a.Promise();
      p.then(
        () => { done(); },
        () => { done(); }
      );
    });

    it('should resolve if the array is empty', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      dataDAO.saveAll([])
        .should.be.fulfilled()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should resolve an array of created objects if the save was successfull', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      const dataToSave = [
        new Data('id0001', Date.now(), 'temperature', 23.4),
        new Data('id0001', Date.now(), 'pression', 43),
        new Data('id0001', Date.now(), 'humidity', 80),
        new Data('id0001', Date.now(), 'temperature', 25.4),
      ];
      dataDAO.saveAll(dataToSave)
        .then((results) => {
          should.equal(results.length, dataToSave.length);
          should.deepEqual(
            results.map(r => r.sensorId).sort(),
            dataToSave.map(d => d.sensorId).sort()
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should save the objects and they should be findable after the save.', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      const props = {};
      const dataToSave = [
        new Data('id0001', Date.now(), 'temperature', 23.4),
        new Data('id0001', Date.now(), 'pression', 43),
        new Data('id0001', Date.now(), 'humidity', 80),
        new Data('id0002', Date.now(), 'temperature', 25.4),
      ];
      dataDAO.saveAll(dataToSave)
        .then((results) => {
          props.results = results;
          return dataDAO.findBySensorId('id0001');
        })
        .then((founds) => {
          should.equal(founds.length, 3);
          should.deepEqual(
            founds.map(r => r.sensorId).sort(),
            props.results.splice(0, 3).map(d => d.sensorId).sort()
          );
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });

  describe('findBySensorId', () => {
    it('should return a Promise', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      const p = dataDAO.findBySensorId('id1');
      p.should.be.a.Promise();
      p.then(
        () => { done(); },
        () => { done(); }
      );
    });

    it('should resolve an array of data if the sensorId corresponds to some data.', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      const ids = [];
      dataDAO.save(new Data('id2', Date.now(), 'temperature', 22))
        .then((s) => {
          ids.push(s.sensorId);
          return dataDAO.save(new Data('id2', Date.now(), 'temperature', 23));
        })
        .then((s) => {
          ids.push(s.sensorId);
          return dataDAO.save(new Data('id2', Date.now(), 'temperature', 24));
        })
        .then((s) => {
          ids.push(s.sensorId);
          return dataDAO.save(new Data('id3', Date.now(), 'temperature', 24));
        })
        .then(() => dataDAO.save(new Data('id3', Date.now(), 'temperature', 25)))
        .then(() => dataDAO.save(new Data('id4', Date.now(), 'temperature', 26)))
        .then(() => dataDAO.save(new Data('id5', Date.now(), 'temperature', 27)))
        .then(() => {
          dataDAO.findBySensorId('id2')
            .then((datas) => {
              datas.should.be.Array();
              should.equal(datas.length, 3);
              should.deepEqual(datas.map(d => d.sensorId).sort(), ids.sort());
              done();
            })
            .catch((err) => {
              done(err);
            });
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should resolve an empty array of data if the sensorId does not correspond to some data.', (done) => {
      dataDAO = new DataDAO(testDatabaseConfig);
      dataDAO.findBySensorId('adkalfbhuowrnjkfbnjknydkjsan')
        .then((datas) => {
          datas.should.be.Array();
          should.equal(datas.length, 0);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
