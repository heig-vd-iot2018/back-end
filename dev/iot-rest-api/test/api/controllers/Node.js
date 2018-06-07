const should = require('should');
const server = require('../../../app');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const request = require('supertest');
const config = require('../../config/database.js');
const { MongoClient } = require('mongodb');
const { userDAO } = require('../../../api/dao/database');
const Node = require('../../../api/models/Node');
const uuidv4 = require('uuid/v4');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME === undefined ? 'admin' : process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD === undefined ? 'admin1234' : process.env.ADMIN_PASSWORD;

let mongoServer;
let testDatabaseConfig;

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

function createABunchOfNodes() {
  const nodes = [];
  for (let i = 0; i < 10000; i += 1) {
    nodes.push(createRandomNode());
  }
  return new Promise((resolve, reject) => {
    const { mongoClient } = testDatabaseConfig;
    const url = `mongodb://${testDatabaseConfig.dbAddress}:${testDatabaseConfig.dbPort}`;
    mongoClient.connect(url, (err, client) => {
      if (err !== null) {
        reject(err);
      } else {
        const db = client.db(testDatabaseConfig.dbName);
        const collection = db.collection('nodes');
        // Insert some documents
        collection.insertMany(nodes, (error, ns) => {
          if (error !== null) {
            reject(error);
          } else {
            resolve(ns.ops);
          }
          client.close();
        });
      }
    });
  });
}

describe('controllers', () => {
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

    if (server.locals.status === 'up') {
      done();
    } else {
      // We wait for the ready event to start the test
      server.on('ready', () => {
        done();
      });
    }
  });

  after((done) => {
    mongoServer.stop();
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
            userDAO.create({
              username: ADMIN_USERNAME,
              password: ADMIN_PASSWORD,
            }).then(() => {
              done();
            }).catch((erruser) => {
              done(erruser);
            });
          }
        });
        client.close();
      }
    });
  });

  describe('GET /nodes', () => {
    it('should retrieve all existing nodes', function testGetNodes(done) {
      this.timeout(30000);
      createABunchOfNodes()
        .then((createdNodes) => {
          const r = request(server);
          r.post('/auth')
            .send({
              username: ADMIN_USERNAME,
              password: ADMIN_PASSWORD,
            })
            .set('Accept', 'application/json')
            .expect(200)
            .end((err, res) => {
              if (err) {
                done(err);
                return;
              }
              const { token } = res.body;
              try {
                should.notEqual(token, undefined);
              } catch (e) {
                done(e);
                return;
              }

              r.get('/nodes')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${token}`)
                .expect(200)
                .end((errGET, resGET) => {
                  if (errGET) {
                    done(errGET);
                  } else {
                    const GETNodes = resGET.body;
                    GETNodes.should.be.Array();
                    should.notEqual(GETNodes, undefined);
                    should.equal(GETNodes.length, createdNodes.length);
                    done();
                  }
                });
            });
        })
        .catch((err) => {
          done(err);
        });
    });
  });
});
