const {
  demuxProbe,
  createAudioResource,
  createAudioPlayer,
  EndBehaviorType,
  StreamType,
} = require("@discordjs/voice");

async function handleCall(callers, globe) {
  for (const caller of callers) {
    const connection = caller.connection;
    const connectionId = caller.connectionId;
    audioTransfer(callers, connectionId, connection, globe);
  }
}

async function audioTransfer(callers, connectionId, connection, globe) {
  const receiver = connection.receiver;
  const players = [];

  for (const caller of callers) {
    if (caller.connectionId === connectionId) continue;

    const player = createAudioPlayer();
    caller.connection.subscribe(player);

    players.push(player);
  }

  receiver.speaking.on("start", async (userId) => {
    const opusStream = receiver.subscribe(userId, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 1000,
      },
    });

    // const nonObjectModeStream = new PassThrough();
    // opusStream.pipe(nonObjectModeStream);

    for (const player of players) {
      const resource = createAudioResource(opusStream, {
        inputType: StreamType.Opus,
      });

      console.log(player.state.status);
      player.play(resource);
      console.log(player.state.status);
    }
  });
}

module.exports = { handleCall };
