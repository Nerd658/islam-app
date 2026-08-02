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

// Route mounting
app.use('/prayer-times', prayerRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
