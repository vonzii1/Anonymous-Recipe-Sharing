require('dotenv').config();
const { s3Upload } = require('./s3');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');
const winston = require('winston');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const session = require('express-session');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const { v4: uuidv4 } = require('uuid');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is missing in .env file!");
    process.exit(1);
}

// ✅ Connect to MongoDB BEFORE defining routes
mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

// ✅ Configure Winston for logging
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

app.use(express.static(path.join(__dirname, 'public')));

// ✅ Apply Middleware BEFORE defining routes
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'trusted-cdn.com'],
            styleSrc: ["'self'", 'fonts.googleapis.com'],
            imgSrc: ["'self'", 'data:', 's3.amazonaws.com'],
        },
    },
    xssFilter: true, // Enable XSS protection
    frameguard: { action: 'deny' }, // Prevent clickjacking
    noSniff: true, // Prevent content sniffing
}));
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors({
    origin: ['http://127.0.0.1:5000', 'http://localhost:5000', 'http://localhost:5500'], // Add your frontend origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow POST and OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
    credentials: true
}));

// ✅ Configure express-session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use a real secret key from environment variables
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true if using HTTPS
}));

// ✅ Initialize Passport for Google OAuth
app.use(passport.initialize());
app.use(passport.session()); // Add this line to use Passport with sessions

// ✅ Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true, // Pass the request object to the callback
    prompt: 'select_account' // Force Google to show the account selection screen
}, (req, accessToken, refreshToken, profile, done) => {
    // Include Google profile information in the token payload
    const tokenPayload = {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        role: 'user',
        picture: profile.photos[0].value,
        iat: Math.floor(Date.now() / 1000) // Issued at timestamp
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    done(null, { profile, token });
}));

// ✅ Serialize user into the session
passport.serializeUser((user, done) => {
    done(null, user);
});

// ✅ Deserialize user from the session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// ✅ Google OAuth Routes
app.get('/auth/google', (req, res, next) => {
    console.log("Google OAuth Login Hit!");
    next();
}, passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        const token = req.user.token;
        // 👇 Redirect to your styled custom index.html with token in query
        res.redirect(`/index.html?token=${token}`);
    }
);

// ✅ Root Route
app.get('/', (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the frontend
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: 'Token is valid', user: decoded });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

// ✅ Serve static files (e.g., frontend assets)
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Token Validation Middleware
const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const token = authHeader.replace('Bearer ', '');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ✅ Role-Based Access Control (RBAC) Middleware
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    next();
};

// ✅ Debugging Middleware
app.use((req, res, next) => {
    console.log(`➡️ Incoming Request: ${req.method} ${req.url}`);
    next();
});

// ✅ Handle CORS Preflight Requests
app.options('/api/recipes', (req, res) => {
    console.log("✅ Handling OPTIONS request for /api/recipes");
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).send();
});

// ✅ Route to communities.html
app.post('/api/communities', authenticate, async (req, res) => {
    const { name } = req.body;
    try {
        const exists = await Community.findOne({ name });
        if (exists) return res.status(400).json({ error: 'Community already exists' });

        const community = new Community({ name, members: [] });
        await community.save();
        res.status(201).json(community);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/communities/:name/join', authenticate, async (req, res) => {
    const { name } = req.params;
    try {
        const community = await Community.findOne({ name });
        if (!community) return res.status(404).json({ error: 'Community not found' });

        if (!community.members.includes(req.user.id)) {
            community.members.push(req.user.id);
            await community.save();
        }

        res.json({ message: 'Joined community' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/communities/:name/leave', authenticate, async (req, res) => {
    const { name } = req.params;
    try {
        const community = await Community.findOne({ name });
        if (!community) return res.status(404).json({ error: 'Community not found' });

        community.members = community.members.filter(memberId => memberId !== req.user.id);
        await community.save();

        res.json({ message: 'Left community' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/communities/joined', authenticate, async (req, res) => {
    try {
        const communities = await Community.find({ members: req.user.id });
        res.json(communities);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Route to fetch user notifications
app.get('/api/notifications', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        console.error("❌ Error fetching notifications:", err);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});

// ✅ POST a chat message
app.post('/api/chat', authenticate, async (req, res) => {
    try {
        const { from, to, text } = req.body;
        const message = new ChatMessage({ from, to, text });
        await message.save();
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ GET messages between two users
app.get('/api/chat/:from/:to', authenticate, async (req, res) => {
    try {
        const { from, to } = req.params;
        const messages = await ChatMessage.find({
            $or: [
                { from, to },
                { from: to, to: from }
            ]
        }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ React to a message
app.post('/api/chat/react/:id', authenticate, async (req, res) => {
    try {
        const message = await ChatMessage.findById(req.params.id);
        if (!message) return res.status(404).json({ error: 'Message not found' });

        const { reaction } = req.body;
        message.reactions = message.reactions || {};
        message.reactions[reaction] = (message.reactions[reaction] || 0) + 1;

        await message.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Route to create a recipe with an image
app.post('/api/recipes', upload.single('image'), [
    body('title').notEmpty().withMessage('Title is required'),
    body('ingredients').notEmpty().withMessage('Ingredients are required'),
    body('instructions').notEmpty().withMessage('Instructions are required'),
    body('author_id').notEmpty().withMessage('Author ID is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log("✅ POST /api/recipes route hit!");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("File:", req.file ? req.file.originalname : "No file received");

    try {
        const { title, ingredients, instructions, author_id } = req.body;
        if (!req.file) {
            console.error("❌ Missing image file!");
            return res.status(400).json({ error: "An image is required!" });
        }

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: req.file.originalname,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        };

        const data = await s3Upload(params);
        console.log("✅ S3 Upload Successful:", data.Location);

        const newRecipe = new Recipe({
            recipe_id: uuidv4(),
            title,
            ingredients: ingredients.split(","), // Ensure it's stored as an array
            instructions,
            author_id,
            imageName: req.file.originalname,
            imageUrl: data.Location,
            contentType: req.file.mimetype,
        });

        const savedRecipe = await newRecipe.save();
        console.log("✅ Recipe saved successfully:", savedRecipe);
        res.status(201).json(savedRecipe);
    } catch (error) {
        console.error("❌ Error saving recipe:", error);
        res.status(500).json({ error: error.message });
    }
});

// ✅ Route to Homepage
app.post('/api/recipes/:id/like', authenticate, async (req, res) => {
    try {
      const recipe = await Recipe.findOne({ recipe_id: req.params.id });
      if (!recipe.liked_by.includes(req.user.id)) {
        recipe.likes++;
        recipe.liked_by.push(req.user.id);
        await recipe.save();
      }
      res.json({ message: "Liked!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });  

  app.post('/api/recipes/:id/dislike', authenticate, async (req, res) => {
    try {
      const recipe = await Recipe.findOne({ recipe_id: req.params.id });
      recipe.dislikes = (recipe.dislikes || 0) + 1;
      await recipe.save();
      res.json({ message: "Disliked!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  app.post('/api/recipes/:id/comments', authenticate, async (req, res) => {
    try {
      const { comment } = req.body;
      const recipe = await Recipe.findOne({ recipe_id: req.params.id });
      recipe.comments.push({
        comment_id: uuidv4(),
        user_id: req.user.id,
        content: comment,
        date_posted: new Date()
      });
      await recipe.save();
      res.json({ message: "Comment added!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

  app.post('/api/recipes/:id/favorite', authenticate, async (req, res) => {
    try {
      const recipe = await Recipe.findOne({ recipe_id: req.params.id });
      if (!recipe.favorited_by.includes(req.user.id)) {
        recipe.favorited_by.push(req.user.id);
        await recipe.save();
      }
      res.json({ message: "Favorited!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });  

app.post('/api/recipes/:id/report', authenticate, async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ recipe_id: req.params.id });
        if (!recipe.reports) recipe.reports = [];
        recipe.reports.push({ user: req.user.id, date: new Date() });
        await recipe.save();
        res.json({ message: 'Reported', recipe });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/liked-recipes', authenticate, async (req, res) => {
    try {
      const recipes = await Recipe.find({ liked_by: req.user.id });
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get('/api/favorite-recipes', authenticate, async (req, res) => {
    try {
      const recipes = await Recipe.find({ favorited_by: req.user.id });
      res.json(recipes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  app.get('/api/recipes/:id/comments', async (req, res) => {
    try {
      const recipe = await Recipe.findOne({ recipe_id: req.params.id });
      if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  
      res.json(recipe.comments);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// ✅ Route to fetch all recipes
app.get('/api/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find(); 
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Route to update a recipe
app.put('/api/recipes/:id', authenticate, async (req, res) => {
    try {
        const { title, ingredients, instructions, author_id } = req.body;
        const updatedRecipe = await Recipe.findOneAndUpdate(
            { recipe_id: req.params.id },
            { title, ingredients, instructions, author_id },
            { new: true }
        );
        if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Route to delete a recipe
app.delete('/api/recipes/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findOneAndDelete({ recipe_id: req.params.id });
        if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found' });
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Logout route
app.get('/logout', (req, res) => {
    req.logout(() => {
        req.session.destroy(); // Destroy session on logout
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('http://localhost:5000/login.html'); // Redirect to login page (or homepage)
    });
});

// ✅ Route to upload a file (for users)
app.post('/upload', upload.single('file'), [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) return res.status(400).send('No file uploaded');

    const { name, email } = req.body;
    
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: req.file.originalname,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
    };

    try {
        const data = await s3Upload(params);
        const user = new User({
            name,
            email,
            fileName: req.file.originalname,
            fileUrl: data.Location,
            contentType: req.file.mimetype,
        });

        await user.save();
        res.status(200).send('File uploaded and metadata saved');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
    
});

// ✅ Route to fetch all users
app.get('/api/users', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving users');
    }
});

// ✅ Define error-handling middleware
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack); // Log the error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ error: message });
};

// ✅ Use error-handling middleware
app.use(errorHandler);
app.get('/api/user-info', authenticate, (req, res) => {
    res.json({ user: req.user });
});
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));

// ✅ Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));