const { createError } = require('./error.middleware');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

exports.requireAdmin = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(createError(401, 'Not authorized as admin, no token'));
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    if (decoded.role !== 'admin') {
      return next(createError(403, 'Forbidden: Admin access required'));
    }
    next();
  } catch (err) {
    return next(createError(401, 'Not authorized as admin, token failed'));
  }
};
