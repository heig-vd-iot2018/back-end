const MongodbMemoryServer = require('mongodb-memory-server').default;
require('should');
const UserDAO = require('../../../api/dao/UserDAO');
const User = require('../../../api/models/User');
const config = require('../../../config/database.js');
const { MongoClient } = require('mongodb');
const roles = require('../../../api/helpers/roles');


let mongoServer;
let testDatabaseConfig;
let userDAO;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME === undefined ? 'admin' : process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD === undefined ? 'admin1234' : process.env.ADMIN_PASSWORD;

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

  beforeEach((done) => {
    const { mongoClient } = testDatabaseConfig;
    const url = `mongodb://${testDatabaseConfig.dbAddress}:${testDatabaseConfig.dbPort}`;
    mongoClient.connect(url, (err, client) => {
      if (err !== null) {
        done(err);
      } else {
        const db = client.db(testDatabaseConfig.dbName);
        const collection = db.collection('users');
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
        userDAO = new UserDAO();
      }).should.throw('Required object is undefined.');
      done();
    });

    it('should throw an Error if one of properties is missing in the settings argument object', (done) => {
      (() => {
        userDAO = new UserDAO({});
      }).should.throw('Missing required property dbAddress.');
      (() => {
        userDAO = new UserDAO({ dbAddress: '' });
      }).should.throw('Missing required property dbPort.');
      (() => {
        userDAO = new UserDAO({ dbAddress: '', dbPort: 0 });
      }).should.throw('Missing required property dbName.');
      (() => {
        userDAO = new UserDAO({ dbAddress: '', dbPort: 0, dbName: '' });
      }).should.throw('Missing required property mongoClient.');
      done();
    });

    it('should not throw an Error if the required settings are provided as argument', (done) => {
      (() => {
        userDAO = new UserDAO(testDatabaseConfig);
      }).should.not.throw();
      done();
    });
  });

  describe('create()', () => {
    this.timeout(2000); // Set the timeout back to normal

    it('should return a Promise.', (done) => {
      userDAO = new UserDAO(testDatabaseConfig);
      const p = userDAO.create(new User(ADMIN_USERNAME, ADMIN_PASSWORD, roles.ADMIN));
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
      userDAO = new UserDAO(falseConfig);
      userDAO.create(new User(ADMIN_USERNAME, ADMIN_PASSWORD, roles.ADMIN))
        .should.be.rejected()
        .then(() => {
          done();
        });
    });

    it('should reject the Promise if the user already exists in the database', (done) => {
      userDAO = new UserDAO(testDatabaseConfig);
      userDAO.create(new User(ADMIN_USERNAME, ADMIN_PASSWORD, roles.ADMIN))
        .then(() => userDAO.create(new User(ADMIN_USERNAME, ADMIN_PASSWORD, roles.ADMIN)))
        .should.be.rejected()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should fulfill the returned Promise if the object was saved in databse', (done) => {
      userDAO = new UserDAO(testDatabaseConfig);
      userDAO.create(new User(ADMIN_USERNAME, ADMIN_PASSWORD, roles.ADMIN))
        .should.be.fulfilled()
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
