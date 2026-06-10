const User = require('../models/User');
const ApiError = require('../utils/ApiError');

/**
 * Get users from the SAME district as the requesting user.
 * Core business rule: users only see their own district.
 */
const getDistrictUsers = async (district, profession = '') => {
  const filter = {
    district,
    isProfileCompleted: true,
  };

  if (profession) {
    filter.profession = profession;
  }

  const users = await User.find(filter)
    .select('-googleId -email -__v')
    .sort({ createdAt: -1 });

  return users;
};

/**
 * Get a single user by ID
 */
const getUserById = async (userId) => {
  const user = await User.findById(userId).select('-googleId -__v');

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

/**
 * Search users within the same district
 */
const searchUsers = async (district, query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const regex = new RegExp(query.trim(), 'i');

  const users = await User.find({
    district,
    isProfileCompleted: true,
    $or: [
      { name: regex },
      { profession: regex },
      { instagramUsername: regex },
    ],
  })
    .select('-googleId -email -__v')
    .limit(20);

  return users;
};

module.exports = {
  getDistrictUsers,
  getUserById,
  searchUsers,
};
