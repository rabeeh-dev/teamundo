const mongoose = require('mongoose');

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha',
  'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur',
  'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad',
  'Kannur', 'Kasaragod',
];

const PROFESSIONS = [
  'developer', 'entrepreneur', 'designer', 'marketer',
  'student', 'government_official', 'freelancer', 'artist',
  'educator', 'healthcare', 'finance', 'other',
];

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      enum: KERALA_DISTRICTS,
    },
    age: {
      type: Number,
      min: 18,
      max: 80,
    },
    profession: {
      type: String,
      enum: PROFESSIONS,
    },
    instagramUsername: {
      type: String,
      trim: true,
      default: '',
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: '',
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 160,
      default: '',
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    customWarnings: [{
      message: String,
      isRead: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }],
  },
  {
    timestamps: true,
  }
);

// Index for district-based queries (core business logic)
userSchema.index({ district: 1, profession: 1 });
userSchema.index({ district: 1, name: 'text' });

// Virtual for onboardingComplete (used by frontend)
userSchema.virtual('onboardingComplete').get(function () {
  return this.isProfileCompleted;
});

// Transform the output to include virtuals and rename _id
userSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.profilePhoto = ret.profileImage;
    ret.instagram = ret.instagramUsername;
    ret.phone = ret.phoneNumber;
    // Don't leak all custom warnings to public, only the user should see their own when authenticated,
    // but the `transform` applies globally. We'll handle this in the auth/user controllers instead.
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);
