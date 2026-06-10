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

const onboardingSchema = {
  name: (value) => {
    if (!value || typeof value !== 'string' || value.trim().length < 2)
      return 'Name is required (min 2 characters)';
    return null;
  },
  district: (value) => {
    if (!value || !KERALA_DISTRICTS.includes(value))
      return 'Valid Kerala district is required';
    return null;
  },
  age: (value) => {
    const num = Number(value);
    if (!num || num < 18 || num > 80) return 'mwone ninakk prayam aayeella';
    return null;
  },
  profession: (value) => {
    if (!value || !PROFESSIONS.includes(value))
      return 'Valid profession is required';
    return null;
  },
  instagram: (value) => {
    if (!value || typeof value !== 'string' || value.trim().length === 0)
      return 'Instagram username is required';
    return null;
  },
};

const updateProfileSchema = {
  name: (value) => {
    if (value !== undefined && (typeof value !== 'string' || value.trim().length < 2))
      return 'Name must be at least 2 characters';
    return null;
  },
};

module.exports = { onboardingSchema, updateProfileSchema };
