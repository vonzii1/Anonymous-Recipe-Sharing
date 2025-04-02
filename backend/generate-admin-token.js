require('dotenv').config();
const jwt = require('jsonwebtoken');

// Create an admin payload
const payload = {
  id: 'admin123',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin', // 👈 This is the key part
  picture: '',
  iat: Math.floor(Date.now() / 1000)
};

// Sign the token using your JWT_SECRET
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '1h'
});

console.log("✅ Your admin token:\n");
console.log(token);
