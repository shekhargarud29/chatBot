async function main(req, res) {
  const { documentId } = req.body; // Expecting the documentId from the request body

  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    if (!documentId) {
      throw new Error("Please enter a document ID.");
    }

    // Delete the document with the provided documentId
    const deleteResult = await collection.deleteOne({ _id: documentId });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        message: "No document found with the given ID.",
      });
    }

    res.status(200).json({
      message: "Document deleted successfully",
      deleteResult,
    });
  } catch (error) {
    console.log("Error in deleteDocument function:", error.message);
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
