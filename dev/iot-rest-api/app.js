require('dotenv').load();
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const jwt = require('jsonwebtoken');
const { userDAO, blacklistedTokenDAO } = require('./api/dao/database');
const roles = require('./api/helpers/roles');
const User = require('./api/models/User');

module.exports = app; // for testing

if (process.env.JWT_SECRET === undefined) {
  console.error('Undefined JWT_SECRET in .env file. It was nice knowing you... Argh...');
  console.log('Exiting');
  process.exit(1);
}
const { JWT_SECRET } = process.env;

const config = {
  appRoot: __dirname, // required config
  swaggerSecurityHandlers: {
    Bearer: function jwtSecurityHandler(req, authOrSecDef, scopesOrApiKey, callback) {
      let token = null;

      // Read the token from header
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        [, token] = req.headers.authorization.split(' ');
        jwt.verify(token, JWT_SECRET, { audience: req.hostname }, (err, decodedToken) => {
          if (err) {
            callback({
              message: 'Invalid or expired token',
              statusCode: 401,
            });
          } else {
            blacklistedTokenDAO.find(token)
              .then((foundToken) => {
                if (foundToken) {
                  callback({
                    message: 'Expired token',
                    statusCode: 401,
                  });
                } else {
                  // Enhancing request object to add current user decoded token
                  req.custom = {};
                  req.custom.currentUserToken = decodedToken;
                  req.custom.currentUserTokenRaw = token;
                  callback(null);
                }
              });
          }
        });
      } else {
        callback({
          message: 'No auth token found',
          statusCode: 401,
        });
      }
    },
  },
};

const ADMIN_USERNAME = process.env.ADMIN_USERNAME === undefined ? 'admin' : process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD === undefined ? 'admin1234' : process.env.ADMIN_PASSWORD;
const DEFAULT_USER_USERNAME = process.env.DEFAULT_USER_USERNAME === undefined ? 'user' : process.env.DEFAULT_USER_USERNAME;
const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD === undefined ? 'user1234' : process.env.DEFAULT_USER_PASSWORD;

const MAX_TIMEOUT = 128000;

// Create default admin and user
function createDefaultUser(timeout) {
  userDAO.create(new User(ADMIN_USERNAME, ADMIN_PASSWORD, roles.ADMIN))
    .then((admin) => {
      console.log('Default admin created');
      console.log(admin);

      return userDAO.create(new User(DEFAULT_USER_USERNAME, DEFAULT_USER_PASSWORD, roles.DEFAULT));
    })
    .then((user) => {
      console.log('Default user created');
      console.log(user);

      // For testing purposes
      app.locals.status = 'up';
      app.emit('ready');
    })
    .catch((err) => {
      if (err.message === 'EXISTING_USER') {
        return;
      }
      
      console.log('Error creating default users.');
      console.log('Error message is:');
      console.log(err.message);
      if (timeout >= MAX_TIMEOUT) {
        console.log(err);
      } else {
        setTimeout(() => { createDefaultUser(timeout * 2); }, timeout);
      }
    });
}

createDefaultUser(1000);

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) {
    throw err;
  }

  // install middleware
  swaggerExpress.register(app);

  const port = process.env.PORT || 10010;
  app.listen(port);
});
