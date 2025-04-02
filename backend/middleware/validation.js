const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Validation rules for recipe creation
const validateRecipe = [
    body('title').notEmpty().withMessage('Title is required'),
    body('ingredients').notEmpty().withMessage('Ingredients are required'),
    body('instructions').notEmpty().withMessage('Instructions are required'),
    body('author_id').notEmpty().withMessage('Author ID is required'),
];

// Validation rules for file uploads
const validateFileUpload = [
    body('file').custom((value, { req }) => {
        if (!req.file) {
            throw new Error('File is required');
        }
        if (!req.file.mimetype.startsWith('image/')) {
            throw new Error('Only image files are allowed');
        }
        if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
            throw new Error('File size must be less than 5MB');
        }
        return true;
    }),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Middleware to authenticate users using JWT
const authenticate = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request object
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware for role-based access control (RBAC)
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};

module.exports = {
    validateRecipe,
    validateFileUpload,
    handleValidationErrors,
    authenticate,
    isAdmin,
};