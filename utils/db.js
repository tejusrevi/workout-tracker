const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://teamEleven:teamEleven@cluster0.f0ra3.mongodb.net/test";
const client = new MongoClient(uri, { useUnifiedTopology: true });
var db;

/**
 * A function to stablish a connection with a MongoDB instance.
 */
async function connectToDB() {
  try {
    // Connect the client to the server
    await client.connect();
    db = await client.db("exercise-tracker-db");
    console.log("Connected successfully to mongoDB");
  } catch (err) {
    throw err;
  }
}
/**
 * This method just returns the database instance
 * @returns A Database instance
 */
async function getDb() {
  return db;
}

async function closeDBConnection() {
  await client.close();
  return "Connection closed";
}

module.exports = { connectToDB, getDb, closeDBConnection };
