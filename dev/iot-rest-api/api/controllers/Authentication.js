const { userDAO } = require('../dao/database');

function signIn(req, res) {
  const { username, password } = req.swagger.params.credentials;
  res.status(200).send();
}

module.exports = {
  signIn,
};
