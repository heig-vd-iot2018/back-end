require('should');
const request = require('supertest');
const server = require('../../../app');
const jwt = require('jsonwebtoken');
const roles = require('../../../api/helpers/roles');


const ADMIN_USERNAME = process.env.ADMIN_USERNAME === undefined ? 'admin' : process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD === undefined ? 'admin1234' : process.env.ADMIN_PASSWORD;

describe('controllers', () => {
  before((done) => {
    if (server.locals.status === 'up') {
      done();
    } else {
      // We wait for the ready event to start the test
      server.on('ready', () => {
        done();
      });
    }
  });

  describe('POST /auth', () => {
    it('should return a JWT generated with the secret when POSTING a valid credentials payload.', (done) => {
      request(server)
        .post('/auth')
        .send({
          username: ADMIN_USERNAME,
          password: ADMIN_PASSWORD,
        })
        .set('Accept', 'text/html')
        .expect(200)
        .end((err, res) => {
          if (err !== null) {
            done(err);
            return;
          }
          res.text.should.be.String();
          const token = res.text;

          jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
            if (error) {
              done(error);
            } else {
              try {
                decodedToken.username.should.be.equal(ADMIN_USERNAME);
                decodedToken.role.should.be.equal(roles.ADMIN);
                done();
              } catch (e) {
                done(e);
              }
            }
          });
        });
    });

    it('should return a 401 when posting a not existing user.', (done) => {
      request(server)
        .post('/auth')
        .send({
          username: 'notauser',
          password: ADMIN_PASSWORD,
        })
        .set('Accept', 'text/html')
        .expect(401)
        .end((err) => {
          if (err) done(err);
          else done();
        });
    });

    it('should return a 401 when posting an existing user but invalid password.', (done) => {
      request(server)
        .post('/auth')
        .send({
          username: ADMIN_USERNAME,
          password: 'randomInvalidPassword',
        })
        .set('Accept', 'text/html')
        .expect(401)
        .end((err) => {
          if (err) done(err);
          else done();
        });
    });

    it('should return a 400 when posting a payload with empty username field', (done) => {
      request(server)
        .post('/auth')
        .send({
          password: ADMIN_PASSWORD,
        })
        .set('Accept', 'text/html')
        .expect(400)
        .end((err) => {
          if (err) done(err);
          else done();
        });
    });

    it('should return a 400 when posting a payload with empty password field', (done) => {
      request(server)
        .post('/auth')
        .send({
          username: ADMIN_USERNAME,
        })
        .set('Accept', 'text/html')
        .expect(400)
        .end((err) => {
          if (err) done(err);
          else done();
        });
    });

    it('should return a 400 when posting an empty payload', (done) => {
      request(server)
        .post('/auth')
        .send({})
        .set('Accept', 'text/html')
        .expect(400)
        .end((err) => {
          if (err) done(err);
          else done();
        });
    });

    it('should return a 400 when posting without a payload', (done) => {
      request(server)
        .post('/auth')
        .set('Accept', 'text/html')
        .expect(400)
        .end((err) => {
          if (err) done(err);
          else done();
        });
    });
  });
});