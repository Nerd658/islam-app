const axios = require('axios');

const getPrayerTimes = async (req, res, next) => {
    try {
        const { city, country, method } = req.query;
        if (!city || !country) {
            return res.status(400).json({ error: 'City and Country are required' });
        }
        
        const calcMethod = method || 3;
        const aladhanUrl = process.env.ALADHAN_API_URL || 'http://api.aladhan.com';
        const response = await axios.get(`${aladhanUrl}/v1/timingsByCity`, {
            params: {
                city: city,
                country: country,
                method: calcMethod
            }
        });

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
