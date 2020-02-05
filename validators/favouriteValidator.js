const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'getFavouriteContacts': {
     return [
        body('uuid', 'uuid is required').not().isEmpty()
       ]
    }
    break;
    case 'createFavouriteContact': {
     return [
        body('uuid', 'uuid is required').not().isEmpty(),
        body('favName', 'name is required').not().isEmpty(),
        body('favSex', 'sex is required').not().isEmpty(),
        body('source', 'source is required').not().isEmpty(),
        body('favMobile', 'mobile is required').not().isEmpty(),
        body('favAccessToWishlist', 'access to wishlist is required').not().isEmpty(),
        body('favMobile', '10 characters required').isLength({min: 10, max: 10})
       ]
    }
    break;
    case 'editFavouriteContact': {
     return [
        body('uuid', 'uuid is required').not().isEmpty(),
        body('favName', 'name is required').not().isEmpty(),
        body('favSex', 'sex is required').not().isEmpty(),
        body('source', 'source is required').not().isEmpty(),
        body('favMobile', 'mobile is required').not().isEmpty(),
        body('favMobile', '10 characters required').isLength({min: 10, max: 10})
       ]
    }
    break;
    case 'removeFavouriteContact': {
     return [
        body('favContactId', 'favContactId is required').not().isEmpty()
       ]
    }
    break;
    case 'uploadImage': {
     return [
        body('filename', 'filename is required').not().isEmpty()
       ]
    }
    break;
    case 'favouritesWishlist': {
     return [
        body('uuid', 'uuid is required').not().isEmpty()
       ]
    }
    break;
  }
}