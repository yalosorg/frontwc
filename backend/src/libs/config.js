const config = {};

config.server = {
    port: process.env.PORT || 3000,
    // ssl: {
    //     key: fs.readFileSync('./ssl/key.pem'),
    //     cert: fs.readFileSync('./ssl/cert.pem')
    // }
}

config.crystalpay = {
    name: "TestWaterCloudLogin",
    key: "b3e54a5a01e00495b618d00acc9db75d77a0102e",
    amount: {
        op1: '100',
        op2: '200',
        op3: '300'
    }
}

config.mongoose = {
    uri: "mongodb://127.0.0.1:27017",
    options: {
        useNewUrlParser: true
    }
}

config.key = 'jwt_secret_key';

module.exports = config;