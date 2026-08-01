const axios = require('axios');

const getPrayerTimes = async (req, res, next) => {
    try {
        const { city, country, method } = req.query;
        if (!city || !country) {
            return res.status(400).json({ error: 'City and Country are required' });
        }
        
        const calcMethod = method || 3;
        const apiUrl = `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${calcMethod}`;
        
        const response = await axios.get(apiUrl);

        if (response.data.code != 200) {
            return res.status(response.data.code).json({ error: response.data.message || 'API error' });
        }

        const timings = response.data.data.timings;
        const hijri = response.data.data.date.hijri;

        const prayerTimes = {
            imsak: timings.Imsak,
            fajr: timings.Fajr,
            sunrise: timings.Sunrise,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha,
            hijriDate: `${hijri.day} ${hijri.month.en} ${hijri.year}`
        };

        res.status(200).json(prayerTimes);
    } catch (error) {
        next(error);
    }
};

module.exports = { getPrayerTimes };
