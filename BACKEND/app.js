const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const prayerRoutes = require('./routes/prayerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Security and Logging middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route mounting
app.use('/prayer-times', prayerRoutes);
app.use('/api/chat', chatRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;
