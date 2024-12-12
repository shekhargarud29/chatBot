async function main(req, res) {
  const data = req.body;

  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }

    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);

    // to insert single document with id
    const insertResult = await collection.insertOne({
      _id: 1,
      departments: [],
    });

    res.status(200).json({
      message: "Document inserted successfully",
      insertResult,
    });
  } catch (error) {
    console.log("Error in main function:", error.message);
    res.status(500).json({
      message: "An error occurred while processing your request.",
      error: error.message, // Optional: Include error details for debugging
    });
  } finally {
    if (client) {
      await client.close();
    }
  }
}

module.exports = {
  main,
};
