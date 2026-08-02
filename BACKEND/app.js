const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');

const prayerRoutes = require('./routes/prayerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Trust reverse proxy for rate limiting behind Vercel/Render/Heroku/NGINX
app.set('trust proxy', 1);

// Security and Logging middlewares
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' })); // Set strictly in production
app.use(express.json({ limit: '10kb' })); // Limit body payload
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(xss()); // Prevent XSS attacks

// Global Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 mins
    max: 100, // limit each IP to 100 requests per window
    message: { error: 'Trop de requêtes globales. Veuillez réessayer plus tard.' }
});
app.use(limiter);

app.use(morgan('dev'));

// Audio TTS Proxy Endpoint (Bypasses browser CORS restrictions & streams crisp Arabic audio)
const https = require('https');
app.get('/api/tts', (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).send('Missing text parameter');

    const encodedText = encodeURIComponent(text);
    const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodedText}&tl=ar&client=tw-ob`;

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');

    https.get(googleUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (ttsRes) => {
        ttsRes.pipe(res);
    }).on('error', (err) => {
        console.error("TTS proxy error:", err);
        res.status(500).send('TTS streaming failed');
    });
});

// Route mounting
app.use('/prayer-times', prayerRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
