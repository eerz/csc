const fs = require("fs");
const { connection } = require(`mongoose`);

async function events(csc, client) {
  // push client in global var
  global.clients.set(csc.connectionId, client);
  // allocate this function for mongo handling incase one hasn't picked up yet.
  const mongoEvents = global.mongo === false ? true : false;
  if (mongoEvents) global.mongo = true;

  const eventFolder = fs.readdirSync(`./src/events`);
  const eventTargetMap = {
    client: client,
    voice: client,
    mongo: connection,
  };

  for (const folder of eventFolder) {
    if (folder === "mongo" && !mongoEvents) continue;

    const eventFiles = fs
      .readdirSync(`./src/events/${folder}`)
      .filter((file) => file.endsWith(".js"));

    const eventTarget = eventTargetMap[folder];
    for (const file of eventFiles) {
      // add stopage here
      const event = require(`../events/${folder}/${file}`);
      if (event.once)
        eventTarget.once(event.name, (...args) =>
          event.execute(...args, client)
        );
      else {
        eventTarget.on(event.name, (...args) => {
          event.execute(...args, client);
        });
      }
    }
  }

  //
}

module.exports = { events };
