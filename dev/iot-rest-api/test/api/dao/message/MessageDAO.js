const MongodbMemoryServer = require('mongodb-memory-server').default;
require('should');
const MessageDAO = require('../../../../api/dao/message/MessageDAO');
const Message = require('../../../../api/models/Message');
const config = require('../../../config/database.js');
const { MongoClient } = require('mongodb');


let mongoServer;
let testDatabaseConfig;
let messageDAO;

describe('MessageDAO', function describeMessageDAO() {
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
        messageDAO = new MessageDAO();
      }).should.throw('Required object is undefined.');
      done();
    });

    it('should throw an Error if one of properties is missing in the settings argument object', (done) => {
      (() => {
        messageDAO = new MessageDAO({});
      }).should.throw('Missing required property dbAddress.');
      (() => {
        messageDAO = new MessageDAO({ dbAddress: '' });
      }).should.throw('Missing required property dbPort.');
      (() => {
        messageDAO = new MessageDAO({ dbAddress: '', dbPort: 0 });
      }).should.throw('Missing required property dbName.');
      (() => {
        messageDAO = new MessageDAO({ dbAddress: '', dbPort: 0, dbName: '' });
      }).should.throw('Missing required property mongoClient.');
      done();
    });

    it('should not throw an Error if the required settings are provided as argument', (done) => {
      (() => {
        messageDAO = new MessageDAO(testDatabaseConfig);
      }).should.not.throw();
      done();
    });
  });

  describe('saveOne()', () => {
    this.timeout(2000); // Set the timeout back to normal

    it('should return a Promise.', (done) => {
      messageDAO = new MessageDAO(testDatabaseConfig);
      const p = messageDAO.saveOne(new Message('author', 'message'));
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
      messageDAO = new MessageDAO(falseConfig);
      messageDAO.saveOne(new Message('author', 'message'))
        .should.be.rejected()
        .then(() => {
          done();
        });
    });

    it('should fulfill the returned Promise if the object was savec in databse', (done) => {
      messageDAO = new MessageDAO(testDatabaseConfig);
      messageDAO.saveOne(new Message('author', 'message'))
        .should.be.fulfilled()
        .then(() => {
          done();
        });
    });
  });
});
