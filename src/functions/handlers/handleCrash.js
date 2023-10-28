module.exports = () => {
  process.on("unhandledRejection", (reason, p) => {
    console.log(" [ Anti-crash ] :: Unhandled Rejection/Catch ");
    console.log(reason, p);
  });

  process.on("uncaughtException", (reason, p) => {
    console.log(" [ Anti-crash ] :: Unhandled Exception/Catch ");
    console.log(reason, p);
  });

  process.on("uncaughtExceptionMonitor", (reason, p) => {
    console.log(" [ Anti-crash ] :: Unhandled Exception/Catch [Monitor]");
    console.log(reason, p);
  });
};
