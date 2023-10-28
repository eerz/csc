const say = require("say");

function textToSpeech(text, outputPath) {
  // Specify a female voice
  const voice = "Karen"; // Change this to the name of the female voice you want to use

  // Convert text to speech with the specified voice
  say.export(text, voice, 1.0, outputPath, (err) => {});
}

module.exports = { textToSpeech };
