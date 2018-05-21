const MongodbMemoryServer = require('mongodb-memory-server').default;
require('should');
const MessageDAO = require('../../../../api/dao/message/MessageDAO');
const Message = require('../../../../api/models/Message');
const config = require('../../../config/database.js');
const { MongoClient } = require('mongodb');


let mongoServer;
let messageDAO;

describe('MessageDAO', function describeMessageDAO() {
  // Here we set the timeout really high to allow to download the libs the first time
  this.timeout(120000);

  before(async (done) => {
    mongoServer = new MongodbMemoryServer(config);
    const port = await mongoServer.getPort();
    const dbHost = 'localhost';
    const dbName = await mongoServer.getDbName();
    messageDAO = new MessageDAO({
      dbAddress: dbHost,
      dbPort: port,
      dbName,
      mongoClient: MongoClient,
    });
    done();
  });

  after((done) => {
    mongoServer.stop();
    done();
  });

  describe('saveOne()', () => {
    this.timeout(200);
    it('should return a Promise.', (done) => {
      const p = messageDAO.saveOne(new Message('author', 'message'));
      p.should.be.a.Promise();
      p.then(
        () => { done(); },
        () => { done(new Error('The Promise was rejected')); }
      );
    });
  });
});
