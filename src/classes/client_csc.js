const { Client, GatewayIntentBits, Partials, Options } = require("discord.js");
const { generateId } = require("../exec/generate/generateId");

class csc_client {
  constructor(guildId, channelId, token) {
    this.guildId = guildId;
    this.channelId = channelId;
    this.token = token;

    this.connectionId = null;
    this.connection = null;
    this.client = null;
  }

  async connect() {
    const client = new Client({
      intents: [
        32767,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.User,
      ],

      sweepers: {
        ...Options.DefaultSweeperSettings,
        messages: {
          interval: 3600,
          lifetime: 3600,
        },
        users: {
          interval: 3600,
          filter: () => (user) => user.bot && user.id !== client.user.id,
        },
      },
    });

    this.connectionId = generateId();

    try {
      await client.login(this.token);
      this.client = client; // Store the client object
      return 200;
    } catch (err) {
      return err; // Return the error
    }
  }
}

module.exports = csc_client;
