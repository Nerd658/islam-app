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
        message: z.string().min(1, "Le message est requis")
    })
});

module.exports = { prayerSchema, chatSchema };
