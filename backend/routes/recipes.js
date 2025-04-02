const express = require('express');
const multer = require('multer');
const s3 = require('../config/s3');
const Recipe = require('../models/Recipe');
const { validateRecipe, handleValidationErrors, authenticate, isAdmin } = require('../middleware/validation');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Create a new recipe (with image upload)
router.post('/api/recipes', upload.single('image'), validateRecipe, handleValidationErrors, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const { title, ingredients, instructions, author_id } = req.body;

        // Upload image to S3
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: req.file.originalname,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        const data = await s3.upload(params).promise();

        // Save recipe to database
        const newRecipe = new Recipe({
            recipe_id: uuidv4(), // Generate a unique recipe ID
            title,
            ingredients: ingredients.split(','), // Convert ingredients string to array
            instructions,
            author_id,
            imageName: req.file.originalname,
            imageUrl: data.Location,
            contentType: req.file.mimetype,
        });

        await newRecipe.save();
        res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Fetch a recipe by ID
router.get('/api/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ recipe_id: req.params.id });
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a recipe by ID (authenticated users only)
router.put('/api/recipes/:id', authenticate, async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findOneAndUpdate(
            { recipe_id: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a recipe by ID (admin only)
router.delete('/api/recipes/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findOneAndDelete({ recipe_id: req.params.id });
        if (!deletedRecipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;