const { mongoose } = require('../libs/index.js');
const {
	Schema, model
} = mongoose;

const schema = new Schema({ 
    email: { type: String, required: true, unique: true },
    login: { type: String, required: true, unique: true },

    password: { type: String, required: true, minlength: 8 },
    subscription: { type: Date, required: true, default: 0 },

    isAdmin: { type: Boolean, required: true, default: false }
});

schema.index(
    {email: 1}, {unique: true, dropDups: true},
    {login: 1}, {unique: true, dropDups: true},
    {isMessages: 1}
);

module.exports = model('Accounts', schema);;