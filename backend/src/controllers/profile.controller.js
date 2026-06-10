const asyncHandler = require('../utils/asyncHandler');
const profileService = require('../services/profile.service');

/**
 * POST /api/users/onboarding
 * Complete user onboarding
 */
const completeOnboarding = asyncHandler(async (req, res) => {
  const user = await profileService.completeOnboarding(req.user._id, req.body);

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * PUT /api/profile/update
 * Update user profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await profileService.updateProfile(req.user._id, req.body);

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * GET /api/profile/me
 * Get own profile
 */
const getOwnProfile = asyncHandler(async (req, res) => {
  const user = await profileService.getOwnProfile(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = {
  completeOnboarding,
  updateProfile,
  getOwnProfile,
};
