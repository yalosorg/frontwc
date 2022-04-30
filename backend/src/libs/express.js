const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// http.createServer(app).listen(server.port, () => console.log('[HTTP] listening!'))

module.exports = app;