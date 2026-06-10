const express = require('express');
const router = express.Router();
const { updateProfile, getOwnProfile } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');

// All profile routes are protected
router.use(protect);

// GET /api/profile/me
router.get('/me', getOwnProfile);

// PUT /api/profile/update
router.put('/update', updateProfile);

module.exports = router;
