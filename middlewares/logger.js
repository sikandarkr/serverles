const winston = require('winston');
const CloudWatchTransport = require('winston-aws-cloudwatch');
const environment =  process.env.STAGE;
const momentTz = require('moment-timezone');
const today = momentTz().tz('Asia/Kolkata').format('MMMM Do YYYY, h:mm:ss a');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new CloudWatchTransport({
      logGroupName: 'giftiicon-user-management-logs', // REQUIRED
      logStreamName: environment, // REQUIRED
      createLogGroup: false,
      createLogStream: true,
      submissionInterval: 2000,
      submissionRetryCount: 1,
      batchSize: 20,
      awsConfig: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      },
      formatLog: item =>
        `${today} - ${item.level}: ${item.message} ${JSON.stringify(item.meta)} `
    })
  ]
});

logger.on('error', function (err) { 
  console.log(err);
});

module.exports = logger;