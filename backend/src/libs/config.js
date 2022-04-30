const config = {};

config.server = {
    port: process.env.PORT || 3000,
    // ssl: {
    //     key: fs.readFileSync('./ssl/key.pem'),
    //     cert: fs.readFileSync('./ssl/cert.pem')
    // }
}

config.mongoose = {
    uri: "mongodb://localhost:27017/test",
    options: {
        useNewUrlParser: true
    }
}

config.key = 'jwt_secret_key';

module.exports = config;