const userSchema = require("../../../data/collection/user");
const callSchema = require("../../../data/collection/call");

async function onConnected(callers, callId) {
  const callersIds = [];

  // note: caller and csc are same
  for (const caller of callers) {
    const guild = await caller.client.guilds.fetch(caller.guildId);
    const channel = await guild.channels.fetch(caller.channelId);
    callersIds.push(caller.connectionId);

    // convert members collection to array & get ready to create user objects
    const membersArr = Array.from(channel.members.values());
    const users = [];

    // create member profile if they dont have one already.
    for await (const member of membersArr) {
      await userSchema.findOneAndUpdate(
        { userId: member.user.id },
        { $setOnInsert: { time: Date.now() } },
        { new: true, upsert: true }
      );

      let type;

      // if only deafened
      if (member.selfDeaf || member.serverDeaf) type = "deaf";

      // if only muted
      if (member.selfMute || member.serverMute) type = "muted";

      // muted and deafened at the same time
      if (
        (member.selfDeaf && member.selfMute) ||
        (member.serverDeaf && member.serverMute)
      )
        type = "deaf & muted";

      const user = {
        lastAction: {
          type: type,
          time: Date.now(),
        },

        time: Date.now(),
      };

      users.push(user);
    }
  }

  // create call profile
  await callSchema.findOneAndUpdate(
    { callId: callId },
    { callers: callersIds, users: users, time: Date.now() },
    { new: true, upsert: true }
  );
}

module.exports = { onConnected };
