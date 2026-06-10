const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Complete user onboarding — set all profile fields
 */
const completeOnboarding = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (user.isProfileCompleted) {
    throw new ApiError(400, 'Onboarding already completed');
  }

  user.name = data.name;
  user.district = data.district;
  user.age = data.age;
  user.profession = data.profession;
  user.instagramUsername = data.instagram;
  user.phoneNumber = data.phone || '';
  user.bio = data.bio || '';
  user.isProfileCompleted = true;

  await user.save();

  return user;
};

/**
 * Update user profile (post-onboarding edits)
 */
const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Only allow updating certain fields (NOT district)
  const allowedFields = ['name', 'profession', 'instagramUsername', 'phoneNumber', 'bio'];
  
  // Map frontend field names to model field names
  const fieldMap = {
    name: 'name',
    profession: 'profession',
    instagram: 'instagramUsername',
    phone: 'phoneNumber',
    bio: 'bio',
    profilePhoto: 'profileImage',
  };

  for (const [frontendKey, modelKey] of Object.entries(fieldMap)) {
    if (data[frontendKey] !== undefined) {
      if (frontendKey === 'profilePhoto' && data[frontendKey].startsWith('data:image')) {
        try {
          const uploadRes = await cloudinary.uploader.upload(data[frontendKey], {
            folder: 'teamundo_profiles',
            transformation: [{ width: 300, height: 300, crop: 'limit' }]
          });
          user[modelKey] = uploadRes.secure_url;
        } catch (error) {
          console.error("Cloudinary upload error:", error);
        }
      } else {
        user[modelKey] = data[frontendKey];
      }
    }
  }

  await user.save();

  return user;
};

/**
 * Get own profile
 */
const getOwnProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

module.exports = {
  completeOnboarding,
  updateProfile,
  getOwnProfile,
};
