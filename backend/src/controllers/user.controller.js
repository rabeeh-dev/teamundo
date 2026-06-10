const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');
const ApiError = require('../utils/ApiError');

/**
 * GET /api/users
 * Get all users from the authenticated user's district
 * Query params: profession (optional)
 * BUSINESS RULE: Always scoped to req.user.district
 */
const getUsers = asyncHandler(async (req, res) => {
  if (!req.user.district) {
    throw new ApiError(400, 'Complete your profile first to discover users');
  }

  const { profession } = req.query;

  // IMPORTANT: Always use the authenticated user's district
  // Never trust district from query params for listing
  const users = await userService.getDistrictUsers(req.user.district, profession);

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

/**
 * GET /api/users/me
 * Get current user's profile
 */
const getMyProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

/**
 * GET /api/users/search
 * Search users within authenticated user's district
 */
const searchUsers = asyncHandler(async (req, res) => {
  if (!req.user.district) {
    throw new ApiError(400, 'Complete your profile first');
  }

  const { q } = req.query;
  const users = await userService.searchUsers(req.user.district, q);

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

/**
 * GET /api/users/:id
 * Get a user by ID
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = {
  getUsers,
  getMyProfile,
  searchUsers,
  getUserById,
};
