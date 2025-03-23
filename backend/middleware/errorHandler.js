const winston = require('winston');

// Configure Winston logger
const logger = winston.createLogger({
    level: 'error',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
});

// Error-handling middleware
const errorHandler = (err, req, res, next) => {
    logger.error(err.stack); // Log the error
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
