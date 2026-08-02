const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.stack || err.message}`);
    const status = err.status || 500;
    const isProd = process.env.NODE_ENV === 'production';
    const message = (status === 500 && isProd) ? 'Erreur interne du serveur' : (err.message || 'Erreur interne du serveur');
    res.status(status).json({ error: message });
};

module.exports = errorHandler;
