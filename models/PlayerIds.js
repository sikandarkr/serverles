const mongoose = require("mongoose");
const saltRounds = 10;
//Define a schema
const Schema = mongoose.Schema;
const PlayerSchema = new Schema({
  uuid: {
    type: String,
    trim: true,
  },
  player_id: {
    type: String,
    trim: true,
  },
});
//saving into database
PlayerSchema.pre("save", function(next) {
  next();
});
module.exports = mongoose.model("PlayerIds", PlayerSchema);
