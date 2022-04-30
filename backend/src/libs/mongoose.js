const mongoose = require('mongoose');

const { 
    mongoose: { uri, options }  
} = require('./config.js');

mongoose.connect(uri, options)
    .then(() => console.log('[MongoDB] connected!'))
    .catch(err => console.error(err));

module.exports = mongoose;