const authCodeSchema = {
  code: (value) => {
    if (!value || typeof value !== 'string') return 'Authorization code is required';
    return null;
  },
};

module.exports = { authCodeSchema };
