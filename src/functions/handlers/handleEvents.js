const fs = require("fs");
const { connection } = require(`mongoose`);

module.exports = (globe) => {
  globe.handleEvent = async () => {
    globe.clients.forEach((client) => {
      const eventFolder = fs.readdirSync(`./src/events`);
      const eventTargetMap = {
        voice: client,
        mongo: connection,
      };

      for (const folder of eventFolder) {
        const eventFiles = fs
          .readdirSync(`./src/events/${folder}`)
          .filter((file) => file.endsWith(".js"));

        const eventTarget = eventTargetMap[folder];

        for (const file of eventFiles) {
          const event = require(`../../events/${folder}/${file}`);
          if (event.once) {
            eventTarget.once(event.name, (...args) =>
              event.execute(...args, client)
            );
          } else {
            eventTarget.on(event.name, (...args) => {
              event.execute(...args, client);
            });
          }
        }
      }
    });
  };
};
