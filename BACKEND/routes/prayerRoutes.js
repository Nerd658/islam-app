const express = require('express');
const router = express.Router();
const { getPrayerTimes } = require('../controllers/prayerController');
const validateRequest = require('../middlewares/validateRequest');
const { prayerSchema } = require('../middlewares/validators');

router.get('/', validateRequest(prayerSchema), getPrayerTimes);

module.exports = router;
