const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    console.log("JWT_SECRET inside generateToken:", process.env.JWT_SECRET);
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;
