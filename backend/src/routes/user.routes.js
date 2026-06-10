const express = require('express');
const router = express.Router();
const {
  getUsers,
  getMyProfile,
  searchUsers,
  getUserById,
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const profileController = require('../controllers/profile.controller');

// All user routes are protected
router.use(protect);

// GET /api/users/me — must be before /:id to avoid conflict
router.get('/me', getMyProfile);

// GET /api/users/search
router.get('/search', searchUsers);

// POST /api/users/onboarding
router.post('/onboarding', profileController.completeOnboarding);

// GET /api/users
router.get('/', getUsers);

// GET /api/users/:id
router.get('/:id', getUserById);

// PUT /api/users/warnings/:warningId/read
router.put('/warnings/:warningId/read', async (req, res, next) => {
  try {
    const user = req.user;
    const warning = user.customWarnings.id(req.params.warningId);
    if (!warning) {
      return res.status(404).json({ success: false, message: 'Warning not found' });
    }
    warning.isRead = true;
    await user.save();
    res.json({ success: true, message: 'Warning marked as read' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
