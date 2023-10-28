const poolSchema = require("../../../data/pool");

async function poolSearcher(csc, globe) {
  const pool = await poolSchema.find({});
  if (!pool || pool?.length === 0) return null;

  let connection = null;

  for (let i = 0; i < pool.length; i++) {
    // check if pool and csc are the same
    if (pool[i].connectionId === csc.connectionId) {
      // check if csc is already in a call, if yes return 200 to inform parent function of the ongoing call
      if (pool[i].callId !== null) {
        connection = 200;
        break;
      }

      // else jump to next interation of the loop
      continue;
    }

    // check if pool is in a call
    if (pool[i].callId !== null) continue;
    // if we are at the end of the pool array then we define connection as the current pool
    if (i === pool.length - 1) connection = pool[i];

    // 50% chance of establishing connection between pool and csc if both meet criteria to get into a call
    const randomNumber = Math.random() * 100;
    if (randomNumber > 50) connection = pool[i];

    // break off of the loop if connection is defined
    if (connection) break;
  }

  // fall back for if some error occured causing for loop to finish without a connection
  if (!connection) return null;
  // return connection to parent function for it to handle and establish connection
  return connection;
}

module.exports = { poolSearcher };
