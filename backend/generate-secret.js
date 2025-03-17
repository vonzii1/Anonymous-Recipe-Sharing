const crypto = require('crypto');


// Generate a random 64-byte (512-bit) secret
const secret = crypto.randomBytes(64).toString('hex');

console.log("Generated SESSION_SECRET:", secret);