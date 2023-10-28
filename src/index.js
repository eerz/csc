const express = require("express");
const bodyParser = require("body-parser");
const { connect, set } = require("mongoose");
const fs = require("fs");
const { Collection } = require("discord.js");

require("dotenv").config();

const { databaseToken, port } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const globe = {
  clients: [],
  eventListeners: new Collection(),
};

global.clients = new Collection();
global.pool = new Collection();
global.mongo = false;

// database connection
set("strictQuery", true);
connect(databaseToken);

// functions handler
const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(globe);
}

globe.handleMemories();

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// route handler call
require("./routes/routeHandler")(app, globe);
