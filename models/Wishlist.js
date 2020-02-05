const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');

const WishlistSchema = new mongoose.Schema({
	uuid: { type: String, unique: true, required: true },
	products: [{
		id: { type: String, required: true },
		createdAt: { type: Date, default: new Date().toISOString() }
	}]
});

WishlistSchema.plugin(timestamps);
WishlistSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Wishlist', WishlistSchema);



