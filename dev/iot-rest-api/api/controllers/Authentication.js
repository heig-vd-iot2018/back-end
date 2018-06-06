const { userDAO, blacklistedTokenDAO } = require('../dao/database');
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
          {
            audience: req.get('host'), // Each token is issued for a specific resource server
            expiresIn: 60 * 60 * 24 * 10, // We want the token to expire in 10 days
          },
          (error, token) => {
            if (error) {
              res.status(500).json(new Error('UNKNOWN_ERROR'));
            } else {
              res.status(200).json({ token });
            }
          }
        );
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
}

function signOut(req, res) {
  const { currentUserTokenRaw } = req.custom;
  blacklistedTokenDAO.create(currentUserTokenRaw)
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      res.status(500).json({ message: err.toString() });
    });
}

module.exports = {
  signIn, signOut,
};
