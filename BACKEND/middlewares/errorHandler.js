const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    const status = err.status || 500;
    const message = err.message || 'Erreur interne du serveur';
    res.status(status).json({ error: message });
};

module.exports = errorHandler;
