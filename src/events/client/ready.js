module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`logged into ${client.user.username}`);
  },
};
