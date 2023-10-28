const { model, Schema } = require("mongoose");

module.exports = model(
  "users",
  new Schema({
    userId: String,

    longestCallTime: Number, // ms, the longest call someone has had with another person
    lifetimeCallTime: Number, // ms, the lifetime total spent in a voice call
    lifetimeCalls: Number, // total number of calls user has been in

    time: Number, // first time they vc'ed
  })
);
