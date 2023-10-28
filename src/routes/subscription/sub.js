const {
  joinVoiceChannel,
  entersState,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

const client_csc = require("../../classes/client_csc");
const { poolAllocater } = require("../../exec/pool/poolAllocater");
const {
  checkConnectionAndDeploy,
} = require("../../exec/checkConnectionAndDeploy");

const { events } = require("../../exec/events");

module.exports = function (app, globe) {
  // Endpoint to check if a user exists
  app.post("/subscribe/csc", async (req, res) => {
    const data = validateData(req, res, globe);
    if (data === 400) return;

    // create a client & return if error
    const csc = await getClient(req, res, data, globe);
    if (csc === 400) return;

    // check if client already exists in global client array
    let exist = false;
    const clients = Array.from(global.clients.values());
    for (const client of clients) {
      if (client.user.id === csc.client.user.id) {
        exist = true;
        break;
      }
    }

    // push client and start its events
    if (!exist) await events(csc, csc.client);

    // return with sucess
    res.status(200).json({
      response: 200,
      connectionId: csc.connectionId,
      text: `enlisted ${csc.client.user.username} (${csc.client.user.id}) for the csc pool. If you want the bot to disconnect from csc please send a post request to /subscribe/csc/disconnect with the provided connectionId.`,
    });

    await poolAllocater(csc, globe);
    await checkConnectionAndDeploy(csc, globe);
  });
};

async function getClient(req, res, data, globe) {
  // create a csc client
  const csc = new client_csc(data.guildId, data.channelId, data.token);
  const connectDiscord = await csc.connect();

  if (connectDiscord !== 200) {
    await res.status(400).json({ response: 400, error: connectDiscord });
    return 400;
  }

  const error = {
    response: 400,
    error: "Guild or Voice Channel invalid",
  };

  const error2 = {
    response: 400,
    error: "Discord did not let bot connect",
  };

  // try to fetch provided guild and channel
  const client = csc.client;
  const guild = await client.guilds.fetch(csc.guildId).catch(() => {});
  if (!guild) {
    res.status(400).json(error);
    return 400;
  }

  const channel = await guild.channels.fetch(csc.channelId).catch(() => {});
  if (!channel) {
    res.status(400).json(error);
    return 400;
  }

  // try to connect to provided voice channel
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: guild.id,
    group: guild.id,
    selfDeaf: false,
    selfMute: false,
    adapterCreator: guild.voiceAdapterCreator,
  });

  await entersState(connection, VoiceConnectionStatus.Ready, 20).catch((e) => {
    return 400;
  });

  if (connection._state.status === "disconnected") {
    res.status(400).json(error2);
    return 400;
  }

  csc.connection = connection;
  return csc;
}

function validateData(req, res, globe) {
  const error = {
    response: 400,
    error: "Incorrect details",
  };

  const body = req?.body;
  if (!body) {
    res.status(400).json(error);
    return 400;
  }

  // importants here
  const guildId = body?.guildId;
  const channelId = body?.channelId;
  const token = body?.token;

  // check if all importants are present
  if (!guildId || !channelId || !token) {
    res.status(400).json(error);
    return 400;
  }

  return {
    response: 200,
    guildId: guildId,
    channelId: channelId,
    token: token,
  };
}
