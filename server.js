const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const bcrypt = require('bcrypt');
const xss = require('xss');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// SECURITY CONFIGURATION (OWASP Mitigation)
// ==========================================

// 1. Helmet: Sets strict HTTP headers including Content Security Policy (CSP)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdnjs.cloudflare.com"], // allow font awesome
            styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "blob:"], // allow local uploads (data URIs)
            mediaSrc: ["'self'", "data:", "blob:", "blob:http://*"], // Ensure video playback from memory blobs
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    // Force HTTPS
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
    }
}));

// 2. Rate Limiting: Mitigate Brute Force and DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes.'
});
app.use(limiter);

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // strict 10 attempts for login
    message: 'Too many login attempts, please try again later.'
});

// 3. Body Parsers (limit size to prevent payload exhaustion)
app.use(express.json({ limit: '10mb' })); // Increased for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Session Management
app.use(session({
    secret: 'sUP3r_s3cr3t_l0v3_st0ry_k3y_998877', // In prod, use process.env.SESSION_SECRET
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,     // Prevent XSS accessing cookies
        secure: true,       // Requires HTTPS
        sameSite: 'strict', // Mitigate CSRF
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
    }
}));


// ==========================================
// USER AUTHENTICATION
// ==========================================

// Hardcoded users (Passwords pre-hashed with bcrypt, cost 10)
// success:success_mahlangu
// thulane:thulane_sigasa
const USERS = {
    'success': '$2b$10$3zqM7rnRL3Tv9lRyEHYVj.JjDRkkC1RrcDuCYtn/6EUOlkF43hsgO',
    'thulane': '$2b$10$AzorxHs30RKJyENRhfqocetv2opvYzmdNA0tXCk0hM1WIzKQyTgqm'
};

// Auth Middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    // If asking for API, return 401. If HTML, redirect to login
    if (req.originalUrl.startsWith('/api')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.redirect('/login');
}

// Routes
app.post('/auth/login', authLimiter, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required.' });
    }

    const lowercaseUser = username.toLowerCase();
    const hash = USERS[lowercaseUser];

    if (hash) {
        const match = await bcrypt.compare(password, hash);
        if (match) {
            // Secure Session Creation (Principle of Least Privilege)
            req.session.user = { id: lowercaseUser, role: 'owner' };
            return res.json({ success: true, message: 'Authenticated successfully.' });
        }
    }

    // Generic error to prevent username enumeration
    res.status(401).json({ error: 'Invalid credentials.' });
});

app.post('/auth/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Could not log out' });
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// ==========================================
// PAGE ROUTES & STATIC FILES
// ==========================================

// Serve Login strictly separate
app.get('/login', (req, res) => {
    if (req.session && req.session.user) return res.redirect('/');
    res.sendFile(path.join(__dirname, 'src', 'login.html'));
});

// Home Page (Protected)
app.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

// Story Page (Protected)
app.get('/story', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'story.html'));
});

// Memories Page (Protected)
app.get('/memories', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'memories.html'));
});

// Protected static files (prevent direct browsing to index.html/story.html/memories.html)
app.use((req, res, next) => {
    if (req.path.endsWith('.html') && req.path !== '/login.html' && !req.session.user) {
        return res.redirect('/login');
    }
    next();
});

// General static files
app.use(express.static(path.join(__dirname, 'src')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/statics', express.static(path.join(__dirname, 'statics')));


// ==========================================
// MEMORIES API (Protected, Validated & Sanitized)
// ==========================================

app.get('/api/memories', requireAuth, (req, res) => {
    // SQLi protected by default in SQLite wrapper when query matches no user input, 
    // but parameterized if it did.
    db.all('SELECT * FROM memories ORDER BY date DESC, created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.json(rows);
    });
});

app.post('/api/memories', requireAuth, (req, res) => {
    const { id, title, date, type, content, mediaUrl } = req.body;

    // Strict Input Validation
    if (!id || !title || !date || !['photo', 'video', 'text'].includes(type)) {
        return res.status(400).json({ error: 'Invalid memory schema' });
    }

    // XSS Sanitization
    const safeTitle = xss(title);
    const safeContent = content ? xss(content) : null;

    // Allow data URIs for media, but block dangerous script execution
    let safeMediaUrl = mediaUrl;
    if (mediaUrl && !mediaUrl.startsWith('data:image/') && !mediaUrl.startsWith('data:video/')) {
        safeMediaUrl = null; // strip unsafe URLs
    }

    // Parameterized Query (SQLi Protection)
    const sql = `INSERT INTO memories (id, title, date, type, content, mediaUrl) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [id, safeTitle, date, type, safeContent, safeMediaUrl], function (err) {
        if (err) return res.status(500).json({ error: 'Failed to save memory' });
        res.status(201).json({ success: true, id });
    });
});

app.delete('/api/memories/:id', requireAuth, (req, res) => {
    const { id } = req.params;

    // Parameterized deletion
    db.run('DELETE FROM memories WHERE id = ?', [id], function (err) {
        if (err) return res.status(500).json({ error: 'Deletion failed' });
        if (this.changes === 0) return res.status(404).json({ error: 'Memory not found' });
        res.json({ success: true });
    });
});


// ==========================================
// HTTPS SERVER STARTUP
// ==========================================
const certPath = path.join(__dirname, 'certs');
let server;

try {
    const sslOptions = {
        key: fs.readFileSync(path.join(certPath, 'server.key')),
        cert: fs.readFileSync(path.join(certPath, 'server.cert'))
    };

    server = https.createServer(sslOptions, app);
    server.listen(PORT, () => {
        console.log(`🔒 Secure HTTPS Server running on https://localhost:${PORT}`);
    });
} catch (e) {
    console.warn("⚠️ SSL Certificates not found in ./certs/ ! Falling back to HTTP for development.");
    app.listen(PORT, () => {
        console.log(`⚠️ HTTP Server running on http://localhost:${PORT}`);
        console.log(`Run 'npm run certs' (or scripts/generate-certs.sh) to enable HTTPS.`);
    });
}
