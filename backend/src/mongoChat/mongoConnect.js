async function mongoConnect(req, res) {
  const { MongoClient } = require("mongodb");
  try {
    const client = new MongoClient(process.env.MONGO_URL);
    await client.connect();
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    res.status(500).json({
      message: "Failed to connect to the database. Please try again later.",
      error: error.message,
    });
  }
}
module.exports = {
  mongoConnect: mongoConnect,
};
