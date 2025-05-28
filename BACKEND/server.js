const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const port = 3001;

app.use(express.json());
app.use(cors());

app.get('/prayer-times', async (req, res) => {

    try {
        
        const {city, country} = req.query;
        if (!city || !country) {
            return res.status(400).json({error: 'City and Country are required'});
        }
        const apiUrl = `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=3`;
1
        const response = await axios.get(apiUrl);

        if (response.data.code !=200) {
            return res.status(response.data.code).json({error: response.data.message});
        }

        const timings = response.data.data.timings;

        const prayerTimes = {
            fajr: timings.Fajr,
            dhuhr: timings.Dhuhr,
            asr: timings.Asr,
            maghrib: timings.Maghrib,
            isha: timings.Isha
        };

        res.status(200).json(prayerTimes);

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'An error occurred', details: error.message});
    }
    
});

// app.listen(port, '0.0.0.0', () => {
//     console.log(`Backend running on http://0.0.0.0:${port}`);
// });


app.listen(port, () => {
    console.log(`Example app listening on port ${port} on the http://localhost:${port}`);
})