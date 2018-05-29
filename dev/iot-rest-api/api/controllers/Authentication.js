const { userDAO } = require('../dao/database');
const jwt = require('jsonwebtoken');

function signIn(req, res) {
  const { username, password } = req.swagger.params.credentials.value;

  userDAO.findByUsername(username)
    .then((user) => {
      if (user === null) {
        res.status(401).json({ message: 'Invalid username or password.' });
      } else if (user.password !== password) {
        res.status(401).json({ message: 'Invalid username or password.' });
      } else {
        // Sign JWT
        jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
          },
          process.env.JWT_SECRET,
          (error, token) => {
            if (error) {
              res.status(500).json(new Error('UNKNOWN_ERROR'));
            } else {
              res.type('text/plain');
              res.status(200).send(token);
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
}

module.exports = {
  signIn,
};
