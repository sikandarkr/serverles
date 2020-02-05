const express = require('express');
var app = express();
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');
const wishlistController = require('../controllers/wishlistController');

/* code lines added By sikandar */
const notificationController = require('../controllers/notificationController');
const {requireApiKey} = require('../validators/apiRequest');
const validator = require('../validators/tokenValidator');
/* end  */
const favouriteValidator = require('../validators/favouriteValidator');
const wishlistValidator = require('../validators/wishlistValidator');

// favourite contact api
app.use('/favourite-contacts/find-contacts', favouriteValidator.validate('getFavouriteContacts'), favouriteController.getFavouriteContacts)
app.use('/favourite-contacts/add-contact', favouriteValidator.validate('createFavouriteContact'), favouriteController.createFavouriteContact)
app.use('/favourite-contacts/edit-contact', favouriteValidator.validate('editFavouriteContact'), favouriteController.editFavouriteContact)
app.use('/favourite-contacts/remove-contact', favouriteValidator.validate('removeFavouriteContact'), favouriteController.removeFavouriteContact)
app.use('/favourite-contacts/upload-image', favouriteValidator.validate('uploadImage'), favouriteController.uploadImage)
app.use('/wishlist/favourites-wishlist', favouriteValidator.validate('favouritesWishlist'), favouriteController.favouritesWishlist)



//wishlist api
app.use('/wishlist/own-list', wishlistValidator.validate('getOwnWishlist'), wishlistController.getOwnWishlist)
app.use('/wishlist/add-to-wish-list', wishlistValidator.validate('addToWishList'), wishlistController.addToWishList)
app.use('/wishlist/remove-from-wish-list', wishlistValidator.validate('removeFromWishList'), wishlistController.removeFromWishList)

/*  route added by sikandar */

// app.use('/notification/create',requireApiKey, validator.validateUser,  notificationValidator.validate('message'), notificationController.create);
app.use('/notification/createPlayerIds', notificationController.createPlayerIds)
// app.use('/notification/create',requireApiKey,  notificationValidator.validate('message'), notificationController.create)
app.use('/notification/sendGiftTeaseNotification',  notificationController.sendGiftAndTeaseNotification)
app.use('/notification/send_by_player_ids', notificationController.sendByPlayerIds);
app.use('/notification/deletePlayerId', notificationController.deletePlayerId);



app.use('', router);
module.exports = app;

