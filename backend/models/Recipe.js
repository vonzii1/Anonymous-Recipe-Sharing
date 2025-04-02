const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const CommentSchema = new mongoose.Schema({
  comment_id: String,
  user_id: String,
  content: String,
  date_posted: Date,
});


const RecipeSchema = new mongoose.Schema({
    recipe_id: { type: String, required: true, unique: true, default: uuidv4 },  // ✅ Auto-generate recipe_id
    title: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    instructions: { type: String, required: true },
    imageName: String, // Name of the uploaded image
    imageUrl: String, // URL of the image stored in S3
    contentType: String, // MIME type of the image
    uploadDate: { type: Date, default: Date.now }, // Timestamp of the upload
    author_id: { type: String, required: true },
    likes: { type: Number, default: 0 },
    comments: [{ comment_id: String, user_id: String, content: String, date_posted: Date }],
    date_created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Recipe', RecipeSchema);

