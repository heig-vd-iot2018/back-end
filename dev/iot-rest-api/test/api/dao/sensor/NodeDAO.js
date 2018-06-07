const MongodbMemoryServer = require('mongodb-memory-server').default;
const should = require('should');
const NodeDAO = require('../../../../api/dao/node/NodeDAO');
const Node = require('../../../../api/models/Node');
const config = require('../../../config/database.js');
const { MongoClient } = require('mongodb');
const uuidv4 = require('uuid/v4');

let mongoServer;
let testDatabaseConfig;
let nodeDAO;

function createRandomNode() {
  const node = new Node(
    uuidv4(),
    Date.now(),
    Date.now(),
    true,
    'asdf',
    'jkle',
    []
  );

  return node;
}

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

  beforeEach((done) => {
    const { mongoClient } = testDatabaseConfig;
    const url = `mongodb://${testDatabaseConfig.dbAddress}:${testDatabaseConfig.dbPort}`;
    mongoClient.connect(url, (err, client) => {
      if (err !== null) {
        done(err);
      } else {
        const db = client.db(testDatabaseConfig.dbName);
        const collection = db.collection('nodes');
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
        nodeDAO = new NodeDAO();
      }).should.throw('Required object is undefined.');
      done();
    });

    it('should throw an Error if one of properties is missing in the settings argument object', (done) => {
      (() => {
        nodeDAO = new NodeDAO({});
      }).should.throw('Missing required property dbAddress.');
      (() => {
        nodeDAO = new NodeDAO({ dbAddress: '' });
      }).should.throw('Missing required property dbPort.');
      (() => {
        nodeDAO = new NodeDAO({ dbAddress: '', dbPort: 0 });
      }).should.throw('Missing required property dbName.');
      (() => {
        nodeDAO = new NodeDAO({ dbAddress: '', dbPort: 0, dbName: '' });
      }).should.throw('Missing required property mongoClient.');
      done();
    });

    it('should not throw an Error if the required settings are provided as argument', (done) => {
      (() => {
        nodeDAO = new NodeDAO(testDatabaseConfig);
      }).should.not.throw();
      done();
    });
  });

  describe('findOne()', () => {
    it('should return a Promise.', (done) => {
      nodeDAO = new NodeDAO(testDatabaseConfig);
      const p = nodeDAO.findById(uuidv4());
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
      nodeDAO = new NodeDAO(falseConfig);
      nodeDAO.findById('')
        .should.be.rejected()
        .then(() => {
          done();
        });
    });

    it('should return null if it cannot find an sensor in the database', (done) => {
      nodeDAO = new NodeDAO(testDatabaseConfig);
      nodeDAO.findById(uuidv4())
        .then((n) => {
          if (n === null) done();
          else done(new Error('Node should be null'));
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should find a Node existing in the database', (done) => {
      const node = new Node(
        uuidv4(),
        Date.now(),
        Date.now(),
        true,
        'asdf',
        'jkle',
        []
      );

      nodeDAO = new NodeDAO(testDatabaseConfig);
      nodeDAO.saveOne(node)
        .then(() => nodeDAO.findById(node.id))
        .then((foundNode) => {
          should.equal(foundNode.id, node.id);
          should.equal(foundNode.createdDate, node.createdDate);
          should.equal(foundNode.updatedDate, node.updatedDate);
          should.equal(foundNode.active, node.active);
          should.equal(foundNode.latitude, node.latitude);
          should.equal(foundNode.longitude, node.longitude);
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    describe('findAll()', () => {
      it('should return a Promise', (done) => {
        nodeDAO = new NodeDAO(testDatabaseConfig);
        const p = nodeDAO.findAll();
        p.should.be.a.Promise();
        p.then(() => {
          done();
        });
      });

      it('should resolve an array of Nodes', (done) => {
        nodeDAO = new NodeDAO(testDatabaseConfig);
        nodeDAO.findAll()
          .then((nodes) => {
            nodes.should.be.Array();
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('should resolve all existing Nodes', (done) => {
        const nodes = [];

        nodeDAO = new NodeDAO(testDatabaseConfig);
        nodeDAO.saveOne(createRandomNode())
          .then((n) => {
            nodes.push(n);
            return nodeDAO.saveOne(createRandomNode());
          })
          .then((n) => {
            nodes.push(n);
            return nodeDAO.saveOne(createRandomNode());
          })
          .then((n) => {
            nodes.push(n);
            return nodeDAO.saveOne(createRandomNode());
          })
          .then((n) => {
            nodes.push(n);
            return nodeDAO.saveOne(createRandomNode());
          })
          .then((n) => {
            nodes.push(n);
            return nodeDAO.findAll();
          })
          .then((foundNodes) => {
            should.equal(foundNodes.length, nodes.length);
            foundNodes.map(n => n.id).sort().should.deepEqual(nodes.map(n => n.id).sort());
            done();
          })
          .catch((err) => {
            done(err);
          });
      });
    });
  });
});
