const config = {};

config.server = {
    port: process.env.PORT || 3000,
    // ssl: {
    //     key: fs.readFileSync('./ssl/key.pem'),
    //     cert: fs.readFileSync('./ssl/cert.pem')
    // }
}

config.mongoose = {
    uri: "mongodb://127.0.0.1:27017",
    options: {
        useNewUrlParser: true
    }
}

config.key = 'jwt_secret_key';

module.exports = config;