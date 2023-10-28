module.exports = {
  name: "err",
  execute(err) {
    console.log(
      `[Database Status]: An error occured with the database connection:\n${err}`
    );
  },
};
