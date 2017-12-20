var mongoose = require('mongoose'), Schema = mongoose.Schema, ObjectId = Schema.ObjectId;

var tokenSchema = new Schema({
	token: String,
	createdAt: {
		type: Date,
		expires: 60,
    default: Date.now
	},
	really: {
		sofar: String
	}
});

var Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
