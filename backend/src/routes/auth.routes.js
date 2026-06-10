const express = require('express');
const router = express.Router();
const { googleCallback, getMe, logout } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');
const { authCodeSchema } = require('../validations/auth.validation');

// POST /api/auth/google/callback
router.post('/google/callback', validate(authCodeSchema), googleCallback);

// GET /api/auth/me (protected)
router.get('/me', protect, getMe);

// POST /api/auth/logout (protected)
router.post('/logout', protect, logout);

const env = require('../config/env');

// POST /api/auth/admin/login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (
    username === env.admin.username &&
    password === env.admin.password
  ) {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ role: 'admin' }, env.jwtSecret, {
      expiresIn: '1d',
    });
    return res.json({ success: true, token });
  }
  return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
});

module.exports = router;
