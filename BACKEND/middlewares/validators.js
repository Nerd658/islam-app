const { z } = require('zod');

const prayerSchema = z.object({
    query: z.object({
        city: z.string().min(1, "La ville est requise"),
        country: z.string().min(1, "Le pays est requis"),
        method: z.string().optional()
    })
});

const chatSchema = z.object({
    body: z.object({
        history: z.array(z.object({
            role: z.string(),
            content: z.string()
        })).optional(),
        message: z.string().optional()
    }).refine(data => (data.history && data.history.length > 0) || !!data.message, {
        message: "Vous devez fournir un message ou un historique de messages"
    })
});

module.exports = { prayerSchema, chatSchema };
