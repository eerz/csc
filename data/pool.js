const { model, Schema } = require("mongoose");

module.exports = model(
  "pool",
  new Schema({
    uid: String,
    connectionId: String,
    callId: String, // if callId is absent it means the connection is currently looking for a caller to connect to.

    botId: String,
    token: String,
    guildId: String,
    channelId: String,

    time: Number,
  })
);
