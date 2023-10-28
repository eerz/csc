const poolSchema = require("../../../data/pool");

async function poolAllocater(csc, globe) {
  const guildId = csc.guildId;
  const botId = csc.client.user.id;
  const token = csc.token;
  const channelId = csc.channelId;

  const uid = `${guildId}:${botId}`;
  global.pool.set(uid, csc);

  await poolSchema.findOneAndUpdate(
    { uid: uid },
    {
      connectionId: csc.connectionId,
      callId: null,

      botId: botId,
      token: token,
      guildId: guildId,
      channelId: channelId,

      time: Date.now(),
    },
    { new: true, upsert: true }
  );

  return;
}

module.exports = { poolAllocater };
