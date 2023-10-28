const { model, Schema } = require("mongoose");

module.exports = model(
  "calls",
  new Schema({
    callId: String,
    callers: [String], // array of connectionId's of instances present in the call (2 for normal call, >2 for grouped calls)

    users: [Object], // an array of objects which contain when the user joined along with other variables
    time: Number,
  })
);

const user = {
  lastAction: {
    type: "deaf", // can be "muted" or "deaf & muted"
    time: Number,
  },

  time: Number,
};
