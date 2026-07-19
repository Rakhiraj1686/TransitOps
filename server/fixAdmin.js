// One-off fix script.
// Run this ONCE from your server project root:  node fixAdmin.js
// It sets isEmailVerified: true and isActive: true on every Admin account —
// needed because these fields were added to the User schema *after* the
// bootstrap Admin document already existed, so it never got their defaults.
//
// Delete this file after running it once.

require('dotenv').config();
const mongoose = require('mongoose');

// Adjust this if your .env uses a different variable name for the connection string
// (e.g. MONGO_URI, DATABASE_URL, MONGODB_URI). Check your db.js/config file to confirm.
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DATABASE_URL;

if (!MONGO_URI) {
  console.error('Could not find a MongoDB connection string in your .env (checked MONGO_URI, MONGODB_URI, DATABASE_URL).');
  console.error('Open this file and set MONGO_URI manually to your connection string, then re-run.');
  process.exit(1);
}

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to database.');

  const User = require('./models/User'); // adjust path if your models folder is elsewhere

  const result = await User.updateMany(
    { role: 'Admin' },
    { $set: { isEmailVerified: true, isActive: true } }
  );

  console.log(`Matched ${result.matchedCount ?? result.n} admin user(s), modified ${result.modifiedCount ?? result.nModified}.`);

  const admins = await User.find({ role: 'Admin' }).select('name email isActive isEmailVerified');
  console.log('Current admin accounts:', admins);

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
