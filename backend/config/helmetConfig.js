const helmet = require('helmet');

const helmetConfig = helmet({
    // Content Security Policy (CSP)
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "fonts.googleapis.com", "https://cdnjs.cloudflare.com", "https://cdn.jsdelivr.net"],
            fontSrc: ["'self'", "fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https://cdn.jsdelivr.net"],
            connectSrc: ["'self'"],
            frameSrc: ["'self'"],
            objectSrc: ["'none'"], // Disallow plugins like Flash
        },
    },
    // Enable XSS Filter in browsers
    xssFilter: true,
    // Prevent clickjacking by denying iframe embedding
    frameguard: { action: 'deny' },
    // Hide the "X-Powered-By" header to avoid exposing server technology
    hidePoweredBy: true,
    // Prevent MIME type sniffing
    noSniff: true,
    // Set HSTS (HTTP Strict Transport Security) to enforce HTTPS
    hsts: {
        maxAge: 31536000, // 1 year in seconds
        includeSubDomains: true, // Apply to subdomains
        preload: true, // Allow preloading in browsers
    },
    // Disable DNS prefetching to improve privacy
    dnsPrefetchControl: { allow: false },
    // Disable IE's "X-Download-Options" header
    ieNoOpen: true,
    // Set "Referrer-Policy" to control referrer information
    referrerPolicy: { policy: 'no-referrer' },
});

module.exports = helmetConfig;