const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

/**
 * POST /api/auth/google/callback
 * Exchange Google OAuth code for JWT
 */
const googleCallback = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const { user, token } = await authService.handleGoogleCallback(code);

  res.status(200).json({
    success: true,
    user,
    token,
  });
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

/**
 * POST /api/auth/logout
 * Logout (client-side token removal — this is a no-op on server for JWT)
 */
const logout = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

module.exports = {
  googleCallback,
  getMe,
  logout,
};
