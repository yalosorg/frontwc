const { mongoose } = require('../libs/index.js');
const {
	Schema, model
} = mongoose;

const schema = new Schema({
	name: { type: String, required: true, unique: true },
	path: { type: String, required: true },

	size: { type: Number, required: true },
	user: {
		ref: 'Accounts',
		type: Schema.Types.ObjectId
	}
});

module.exports = model('Resources', schema);