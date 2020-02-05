const logger = require('./logger');
const request = require('request');
const configs = require('../config/configs').configs;

exports.getPreSignUrl = function (filename, bucket) {
    
    return new Promise((resolve, reject) => {
        request.post(configs.s3_buckets.presign_url, {
            json: true,
            body: {
                BucketName: bucket,
                methodType: 'POST',
                FileName: filename
            }
        }, function (err, res, body) {
            if(err){
                logger.log('error', "presign url generated" , {type: "getPreSignUrl", err: err, tags: 'presignUrl err'});
                console.log(err);
            }
            logger.log('info', "presign url generated" , {type: "getPreSignUrl", filename: filename, tags: 'presignUrl generated'});
            resolve(res);
        });
    });
}

