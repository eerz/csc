const { createAudioResource, createAudioPlayer } = require("@discordjs/voice");

const { handleCall } = require("./handleCall");

const { generateId } = require("../generate/generateId");
const { textToSpeech } = require("../generate/textToSpeech");

const poolSchema = require("../../../data/pool");
const { onConnected } = require("../collection/onConnected");

async function deploy(csc, connectionId, globe) {
  const callers = [];

  const caller2Stripped = await poolSchema.findOne({
    connectionId: connectionId,
  });

  // check for any possible double connection error
  if (!caller2Stripped) return 400;
  if (caller2Stripped?.callId !== null) return 400;

  const caller2 = global.pool.get(
    `${caller2Stripped.guildId}:${caller2Stripped.botId}`
  );

  if (!caller2) return 400;

  // get both the callers
  callers.push(csc);
  callers.push(caller2);

  if (callers.length !== 2) return 400;

  // immediately allocate the caller as taken
  const callId = await takenCaller(callers, globe);
  if (callId === true) return 400;

  // create connection now
  setTimeout(async () => {
    // play connection established sound
    for await (const caller of callers) {
      const guild = await caller.client.guilds.fetch(caller.guildId);
      const channel = await guild.channels.fetch(caller.channelId);

      const text = `Connection established with ${guild.name} server with ${channel.members.size} people in vc`;
      const voicePath = `./audio/${guild.id}${channel.id}.ogg`;
      textToSpeech(text, voicePath);

      const player = createAudioPlayer();
      caller.connection.subscribe(player);
      player.play(createAudioResource(voicePath));
    }
  }, 5000);

  setTimeout(async () => {
    onConnected(callers, callId);
    handleCall(callers, globe);
  }, 10000);
}

async function takenCaller(callers, globe) {
  const callId = generateId();
  let err = false;

  for await (const caller of callers) {
    await poolSchema
      .findOneAndUpdate(
        { connectionId: caller.connectionId },
        { callId: callId }
      )
      .catch((e) => {
        err = true;
      });

    if (err) break;
    global.pool.delete(`${caller.guildId}:${caller.client.user.id}`);
  }

  if (err) {
    for await (const caller of callers) {
      await poolSchema
        .findOneAndUpdate(
          { connectionId: caller.connectionId },
          { callId: null }
        )
        .catch((e) => {
          err = true;
        });
    }

    return true;
  }

  return callId;
}

module.exports = { deploy };
