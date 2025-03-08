const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  fileName: String,
  fileUrl: String,
  contentType: String,
  uploadDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);
