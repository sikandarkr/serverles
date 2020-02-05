const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'getOwnWishlist': {
     return [
        body('uuid', 'uuid is required').not().isEmpty()
       ]
    }
    break;
    case 'addToWishList': {
     return [
        body('uuid', 'uuid is required').not().isEmpty(),
        body('productId', 'id is required').not().isEmpty(),
       ]
    }
    break;
    case 'removeFromWishList': {
     return [
        body('uuid', 'uuid is required').not().isEmpty(),
        body('productId', 'id is required').not().isEmpty()
       ]
    }
    break;
  }
}