const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Strict Islamic Prompt to avoid hallucination
const PROMPT_SYSTEM = process.env.PROMPT_SYSTEM || `Tu es un expert en sciences islamiques et histoire islamique. Tes réponses doivent se baser uniquement sur le Coran, la Sunnah authentique (Boukhari, Mouslim, etc.) et l'Histoire vérifiée. 
Règles strictes :
1. Ne donne jamais de Fatwa (avis juridique).
2. Cite toujours tes sources si possible.
3. Si tu ne connais pas la réponse ou si elle n'est pas claire dans les textes authentiques, dis simplement 'Je ne sais pas' (Allahu A'lam).
4. Sois bienveillant, respectueux et réponds dans la langue de l'utilisateur.`;

app.use(express.json());
app.use(cors());

// --- Prayer Times Endpoint ---
app.get('/prayer-times', async (req, res) => {
    try {
        const { city, country, method } = req.query;
        if (!city || !country) {
            return res.status(400).json({ error: 'City and Country are required' });
        }
        
        // Default to method 3 (Muslim World League) if not provided, but allow frontend to specify
        const calcMethod = method || 3;
        const apiUrl = `http://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${calcMethod}`;
        
        const response = await axios.get(apiUrl);

        if (response.data.code != 200) {
            return res.status(response.data.code).json({ error: response.data.message || 'API error' });
        }

        const timings = response.data.data.timings;
        const hijri = response.data.data.date.hijri;

        // Includes Shuruq and Imsak as requested
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
        console.error("Prayer API Error:", error.message);
        res.status(500).json({ error: 'An error occurred fetching prayer times' });
    }
});

// --- Chatbot Endpoint ---
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: "Vous devez fournir un message" });
    }
    if (!OPENROUTER_API_KEY) {
        return res.status(503).json({ error: "Le service de chat est momentanément indisponible (Clé API manquante)" });
    }

    const payload = {
        "model": "deepseek/deepseek-r1-distill-llama-70b:free",
        "messages": [
            {
                "role": "system",
                "content": PROMPT_SYSTEM
            },
            {
                "role": "user",
                "content": userMessage
            }
        ]
    };

    const config = {
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        }
    };

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            payload,
            config
        );

        const reply = response.data.choices[0].message.content.trim();
        res.json({ reply });
    } catch (error) {
        console.error('Erreur Chatbot API:', error.response ? error.response.data : error.message);
        let errorMessage = 'Désolé, une erreur est survenue avec le chatbot.';
        if (error.response?.data?.error?.message) {
            errorMessage = error.response.data.error.message;
        }
        res.status(error.response ? error.response.status : 500).json({ error: errorMessage });
    }
});

// Export app for testing
if (require.main === module) {
    app.listen(port, '0.0.0.0', () => {
        console.log(`Backend running on http://0.0.0.0:${port}`);
    });
}

module.exports = app;