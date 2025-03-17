const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    // Validate user credentials (e.g., check database)
    if (email === 'user@example.com' && password === 'password') {
        // Generate a new token with the updated JWT_SECRET
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});