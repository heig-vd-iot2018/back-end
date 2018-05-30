require('dotenv').load();
const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const jwt = require('jsonwebtoken');
const { userDAO } = require('./api/dao/database');
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
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
          if (err) {
            callback(new Error('Invalid token'));
          } else {
            // TODO: Check in DB if decodedToken is black listed

            // Enhancing request object to add current user decoded token
            req.custom = {};
            req.custom.currentUserToken = decodedToken;
            callback(null);
          }
        });
      } else {
        callback(new Error('No auth token found'));
      }
    },
  },
};

const ADMIN_USERNAME = process.env.ADMIN_USERNAME === undefined ? 'admin' : process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD === undefined ? 'admin1234' : process.env.ADMIN_PASSWORD;
const DEFAULT_USER_USERNAME = process.env.DEFAULT_USER_USERNAME === undefined ? 'user' : process.env.DEFAULT_USER_USERNAME;
const DEFAULT_USER_PASSWORD = process.env.DEFAULT_USER_PASSWORD === undefined ? 'admin' : process.env.DEFAULT_USER_PASSWORD;

const MAX_TIMEOUT = 128000;

// Create default admin and user
function createDefaultUser(timeout) {
  userDAO.create(new User(ADMIN_USERNAME, ADMIN_PASSWORD, roles.ADMIN))
    .then((admin) => {
      console.log('Default admin created');
      console.log(admin);

      userDAO.create(new User(DEFAULT_USER_USERNAME, DEFAULT_USER_PASSWORD, roles.DEFAULT))
        .then((user) => {
          console.log('Default user created');
          console.log(user);

          // For testing purposes
          app.locals.status = 'up';
          app.emit('ready');
        })
        .catch((err) => {
          console.log('Error creating default user with role user.');
          if (timeout >= MAX_TIMEOUT) {
            console.log(err);
          } else {
            setTimeout(() => { createDefaultUser(timeout * 2); }, timeout);
          }
        });
    })
    .catch((err) => {
      console.log('Error creating default admin.');
      if (timeout >= MAX_TIMEOUT) {
        console.log(err);
      } else {
        setTimeout(() => { createDefaultUser(timeout * 2); }, timeout);
      }
    });
}

createDefaultUser(1000);

SwaggerExpress.create(config, (err, swaggerExpress) => {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  const port = process.env.PORT || 10010;
  app.listen(port);
});
