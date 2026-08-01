const axios = require('axios');
const env = require('../config/env');

const postChat = async (req, res, next) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: "Vous devez fournir un message" });
        }
        if (!env.OPENROUTER_API_KEY) {
            return res.status(503).json({ error: "Le service de chat est momentanément indisponible (Clé API manquante)" });
        }

        const payload = {
            "model": "deepseek/deepseek-r1-distill-llama-70b:free",
            "messages": [
                {
                    "role": "system",
                    "content": env.PROMPT_SYSTEM
                },
                {
                    "role": "user",
                    "content": userMessage
                }
            ]
        };

        const config = {
            headers: {
                "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        };

        const openRouterUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai';
        const response = await axios.post(`${openRouterUrl}/api/v1/chat/completions`, payload, config);

        const reply = response.data.choices[0].message.content.trim();
        res.json({ reply });
    } catch (error) {
        if (error.response?.data?.error?.message) {
            error.message = error.response.data.error.message;
            error.status = error.response.status;
        } else {
            error.message = 'Erreur lors de l\'appel au Chatbot';
        }
        next(error);
    }
};

module.exports = { postChat };
