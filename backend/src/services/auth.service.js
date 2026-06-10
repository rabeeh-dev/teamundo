const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { google } = require('../config/env');
const ApiError = require('../utils/ApiError');

const oAuth2Client = new OAuth2Client(
  google.clientId,
  google.clientSecret,
  google.redirectUri
);

/**
 * Exchange Google OAuth code for tokens, get user info,
 * find or create user, return JWT + user data
 */
const handleGoogleCallback = async (code) => {
  // Exchange code for tokens
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  // Get user info from Google
  const ticket = await oAuth2Client.verifyIdToken({
    idToken: tokens.id_token,
    audience: google.clientId,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new ApiError(401, 'Failed to verify Google token');
  }

  const { sub: googleId, email, name, picture } = payload;

  // Find or create user
  let user = await User.findOne({ googleId });

  if (!user) {
    user = await User.create({
      googleId,
      email,
      name,
      profileImage: picture || '',
    });
  } else {
    if (user.isBlocked) {
      throw new ApiError(403, 'Your account has been blocked by the administrator.');
    }
    // Update profile image and name from Google on each login
    user.profileImage = picture || user.profileImage;
    user.name = user.isProfileCompleted ? user.name : (name || user.name);
    await user.save();
  }

  const token = signToken(user._id);

  return { user, token };
};

/**
 * Get current authenticated user
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

module.exports = {
  handleGoogleCallback,
  getCurrentUser,
};
