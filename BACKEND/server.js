const app = require('./app');
const env = require('./config/env');

const port = env.PORT;

app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Backend running securely on http://0.0.0.0:${port}`);
});