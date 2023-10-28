module.exports = {
  name: "voiceStateUpdate",

  async execute(oldState, newState, client) {
    const { channel, guild } = newState;
    const oldChannel = oldState.channel;
    const newChannel = newState.channel;
    const member = oldState.member;

    // member joined a channel and didnt leave
    if (!oldChannel && newChannel) return;
    console.log(`${member.user.username} left a channel`);
  },
};
