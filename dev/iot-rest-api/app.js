'use strict';

require('dotenv').load();
var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var jwt = require('jsonwebtoken');

module.exports = app; // for testing

if (process.env.JWT_SECRET === undefined) {
  console.error("Undefined JWT_SECRET in .env file. It was nice knowing you... Argh...");
  console.log("Exiting");
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

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});
