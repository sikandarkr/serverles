const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'message': {
     return [
        body('payload.message', 'uuid is required').not().isEmpty()
       ]
    }
    break;
  }
}