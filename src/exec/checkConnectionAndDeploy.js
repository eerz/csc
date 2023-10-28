const { createAudioResource, createAudioPlayer } = require("@discordjs/voice");

const { poolSearcher } = require("./pool/poolSearcher");
const { deploy } = require("./connection/deploy");

async function checkConnectionAndDeploy(csc, globe) {
  let con = null;
  let intervalId; // Declare a variable to hold the interval ID

  intervalId = setInterval(async () => {
    con = await poolSearcher(csc, globe);
    if (con === 200) {
      clearInterval(intervalId); // Stop the interval
      return;
    }

    if (!con) {
      const player = createAudioPlayer();
      player.play(createAudioResource("./audio/ringtone.ogg"));
      csc.connection.subscribe(player);
    } else {
      clearInterval(intervalId); // Stop the interval
      const cas = await deploy(csc, con.connectionId, globe);

      // If cas is 400, restart the function
      if (cas === 400) {
        await checkConnectionAndDeploy(csc, globe);
      }
    }
  }, 5000);
}

module.exports = { checkConnectionAndDeploy };
