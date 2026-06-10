const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/env');

/**
 * Sign a JWT token for a user
 */
const signToken = (userId) => {
  return jwt.sign({ id: userId }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

/**
 * Verify a JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = { signToken, verifyToken };
