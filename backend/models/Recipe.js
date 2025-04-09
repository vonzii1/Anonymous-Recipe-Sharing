const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

// ✅ Comment Schema
const CommentSchema = new mongoose.Schema({
  comment_id: { type: String, default: uuidv4 },
  user_id: { type: String, required: true },
  content: { type: String, required: true },
  date_posted: { type: Date, default: Date.now }
});

// ✅ Main Recipe Schema
const RecipeSchema = new mongoose.Schema({
  recipe_id: { type: String, required: true, unique: true, default: uuidv4 },  // Auto-generate recipe_id
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  imageName: String, // Name of the uploaded image
  imageUrl: String,  // URL of the image stored in S3
  contentType: String, // MIME type of the image
  uploadDate: { type: Date, default: Date.now }, // Timestamp of the upload
  author_id: { type: String, required: true },

  // ❤️ Likes and dislikes logic
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  liked_by: [{ type: String }], // user IDs that liked
  disliked_by: [{ type: String }], // user IDs that disliked

  // 💬 Comments
  comments: [CommentSchema],

  // ⭐ Favorites
  favorited_by: [{ type: String }], // store user_id or email who favorited
  favorites: {
    type: [String], // Store user IDs
    default: []
  },
  // 📅 Timestamps
  date_created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);
