const mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var uniqueValidator = require('mongoose-unique-validator');

const FavouriteSchema = new mongoose.Schema({
	uuid: { type: String, required: true },
	contact_name: { type: String, required: true },
	contact_nickname: { type: String },
	contact_relation: { type: String, enum: ['mom', 'dad', 'brother', 'sister', 'boyfriend', 'girlfriend', 'wife', 'husband', 'son', 'daughter', 'bff'] },
	contact_sex: { type: String, enum: ['male', 'female', 'did_not_disclose'], required: true },
	contact_email: { type: String },
	contact_profile_image: { type: String },
	contact_mobile: { type: Number, required: true },
	contact_source: { type: String, enum: ['facebook', 'phonebook'], required: true },
	contact_access_to_wishlist: { type: Boolean, required: true },
	contact_source_id: { type: String },
	contact_occasion: [{
		name: { type: String },
		date: { type: Date }
	}]
});


FavouriteSchema.plugin(timestamps);
FavouriteSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Favourites', FavouriteSchema);



