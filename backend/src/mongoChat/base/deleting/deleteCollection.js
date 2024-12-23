async function main(req, res) {
  //   const { collectionName } = req.body; // Expecting the collection name from the request body
  const collectionName = process.env.MONGO_COLLECTION;

  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);

    if (!collectionName) {
      throw new Error("Please enter the collection name.");
    }

    // Drop the collection
    const dropResult = await db.collection(collectionName).drop();

    if (dropResult) {
      res.status(200).json({
        message: `Collection '${collectionName}' deleted successfully.`,
      });
    } else {
      res.status(404).json({
        message: `No collection found with the name '${collectionName}'.`,
      });
    }
  } catch (error) {
    console.log("Error in deleteCollection function:", error.message);
    res.status(500).json({
      message: "An error occurred while processing your request.",
      error: error.message,
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
