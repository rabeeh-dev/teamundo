const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.error('Usage: node makeAdmin.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  const user = await User.findOneAndUpdate(
    { email: emailToPromote },
    { isAdmin: true },
    { new: true }
  );

  if (user) {
    console.log(`Successfully promoted ${user.email} to Admin!`);
  } else {
    console.log(`User with email ${emailToPromote} not found.`);
  }
  process.exit(0);
})
.catch(err => {
  console.error('Error connecting to DB:', err);
  process.exit(1);
});
