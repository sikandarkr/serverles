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

exports.getUuidsFromMobile = function (uuid, mobiles, token) {
    return new Promise((resolve, reject) => {
        var options = { 
            method: 'POST',
            url: 'https://dev-umg.giftiicon.com/api/v1/get-user-by-mobile',
            headers: { 
                'cache-control': 'no-cache',
                'Connection': 'keep-alive',
                'Content-Length': '888',
                'Accept-Encoding': 'gzip, deflate',
                'Host': 'dev-umg.giftiicon.com',
                'Cache-Control': 'no-cache',
                'Accept': '*/*',
                'Content-Type': 'application/json' 
            },
            body: { 
                mobiles: mobiles,
                user: uuid,
                token: token 
            },
            json: true 
            };
            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                // console.log(body);
                resolve( body )
            });
    });
}