var jwt = require("jsonwebtoken");
var fs = require('fs');
  module.exports = {
    validateUser:(req,res, next)=>{
      // console.log("client token is ", req.headers['x-access-token'] || req.headers['authorization'])
        var key = fs.readFileSync('public.key'); 
        let token = req.headers['x-access-token'] || req.headers['authorization']; 
        if (token.startsWith('Bearer ')) {
          // Remove Bearer from string
          token = token.slice(7, token.length).trimLeft();
        }
        if (token) {
          jwt.verify(token, key, { algorithm: 'RS256'}, (err, decoded) => {
            if (err) {
              return res.json({
                success: false,
                message: 'Token is not valid',
                err:err
              });
            }
            else{
              req.decoded = decoded;
              next();
            }
          });
        } 
    }
}