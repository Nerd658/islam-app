const express = require('express');
const router = express.Router();
const { postChat } = require('../controllers/chatController');
const rateLimit = require('express-rate-limit');
const validateRequest = require('../middlewares/validateRequest');
const { chatSchema } = require('../middlewares/validators');

// Protect chat endpoint from abuse (rate limiting)
const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 requests per 15 minutes
    message: { error: 'Trop de requêtes. Veuillez réessayer plus tard.' }
});

router.post('/', chatLimiter, validateRequest(chatSchema), postChat);

module.exports = router;
