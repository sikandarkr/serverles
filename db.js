const mongoose = require('mongoose');
const logger = require('./middlewares/logger');

mongoose.Promise = global.Promise;
let isConnected;
const option = {
  keepAlive: true,
  // reconnectTries: 30000,
  reconnectTries: 2,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
};

module.exports.connectToDatabase = () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }
  console.log('=> using new database connection');
  return mongoose.connect(process.env.DB, option)
    .then(db => {
      isConnected = db.connections[0].readyState;
    },
    err => {
      console.log('=> error in creating db connection');
      console.log("####### error in connection database ########",err);
      logger.error(err);
    });
};
