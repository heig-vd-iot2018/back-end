const should = require('should');
const server = require('../../../app');
const MongodbMemoryServer = require('mongodb-memory-server').default;
const request = require('supertest');
const jwt = require('jsonwebtoken');
const roles = require('../../../api/helpers/roles');
const config = require('../../config/database.js');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME === undefined ? 'admin' : process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD === undefined ? 'admin1234' : process.env.ADMIN_PASSWORD;

let mongoServer;

describe('controllers', () => {
  before(async (done) => {
    mongoServer = new MongodbMemoryServer(config);

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

  describe('POST /sensors/data', () => {
    it('should return a 400 when posting a payload with empty payload field.', (done) => {

      const r = request.agent(server);

      // Get JWT with the test user
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

          // Get JWT 
          const { token } = res.body;
          

          r.post('/logout')
            .set('Authorization', `Bearer ${token}`)
            .set('Content-type', 'application/json')
            .send({
              id: "BME680",
              payload: "dffddf"
            })
            .expect(400)
            .end((err, res) => {

              if (err) {
                done(err);
              }
              else done();
            });
        });
    });
  });
});
