const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from header
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
        }

        req.user = decoded; // Attach decoded user data to the request
        next();
    });
}

module.exports = verifyToken;