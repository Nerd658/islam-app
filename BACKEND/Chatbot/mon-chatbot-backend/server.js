const express = require('express');
const axios = require('axios'); 
const dotenv = require('dotenv');
dotenv.config();

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const MON_SITE_URL = process.env.MON_SITE_URL;
const MON_SITE_NAME = process.env.MON_SITE_NAME;
const PROMPT_SYSTEM = process.env.PROMPT_SYSTEM

if (!OPENROUTER_API_KEY) {
    console.error('OPENROUTER_API_KEY is not defined');
}

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.get ('/' , (req, res) => {
    res.send(' <H1> Hello World ca fonctionne ! </H1>');
})

app.post ('/api/chat',  async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.status(400).json({ error: "vous devez fournir un message"})
        }
    if (!PROMPT_SYSTEM) {
        return res.status(400).json({ error: "service momentanement indisponible"})
        }
    

    console.log("message de lutilisateur: " + userMessage)

    const playload = {
        "model": "deepseek/deepseek-r1-distill-llama-70b:free",
        "messages": [

        {
            "role" : "system",
            "content" : PROMPT_SYSTEM
        },
        {
            "role": "user",
            "content": `Toujours repondre dans la langue posere par l'utilisateur : ${userMessage}`
        }
        ]
    }

    const config = {
        headers: {
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
        }
    }

    try {
        const reponse = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            playload,
            config
            

        )

        const reponsebot = reponse.data.choices[0].message.content.trim();
        console.log("reponse du bot: " + reponsebot)

        res.json( {
            reply: reponsebot
        })


    }
    catch(error) {
        console.error(error);
        console.error('Erreur lors de l"appel à l"API OpenRouter :', error.response ? error.response.data : error.message);
        let errorMessage = 'Désolé, une erreur est survenue avec le chatbot.';
        if (error.response && error.response.data && error.response.data.error && error.response.data.error.message) {
            errorMessage = error.response.data.error.message;
        } else if (error.response && error.response.data && error.response.data.detail) {
            errorMessage = error.response.data.detail;
        }

        res.status(error.response ? error.response.status : 500).json({ error: errorMessage });

    }
})
    

app.listen(port, () => {
    console.log('le service a demare sur le port ' + port);

    if(!OPENROUTER_API_KEY) {
        console.warn('OPENROUTER_API_KEY n"est pas defini, le service ne fonctionnera pas correctement');
    }else {
        console.log('OPENROUTER_API_KEY est charger correctement');
    }
    
})

