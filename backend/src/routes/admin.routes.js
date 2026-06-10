const express = require('express');
const User = require('../models/User');
const { requireAdmin } = require('../middleware/admin.middleware');
const { createError } = require('../middleware/error.middleware');

const router = express.Router();

// Apply admin middleware to all routes
router.use(requireAdmin);

// @route   GET /api/admin/users
// @desc    Get all users (with basic details)
router.get('/users', async (req, res, next) => {
  try {
    const { district, profession } = req.query;
    let query = {};
    
    if (district) query.district = district;
    if (profession) query.profession = profession;

    const users = await User.find(query)
      .select('-__v')
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get full details of a specific user for admin
router.get('/users/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }
    res.json({
      success: true,
      user,
    });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/admin/users/:id/warn
// @desc    Send a custom warning to a user
router.post('/users/:id/warn', async (req, res, next) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return next(createError(400, 'Warning message is required'));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    user.customWarnings.push({ message });
    await user.save();

    res.json({
      success: true,
      message: 'Warning sent successfully',
      user,
    });
  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/admin/users/:id/block
// @desc    Toggle block status for a user
router.put('/users/:id/block', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return next(createError(404, 'User not found'));
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      isBlocked: user.isBlocked,
      user,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
