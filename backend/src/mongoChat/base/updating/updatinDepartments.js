async function main(req, res) {
  const { documentId, departments } = req.body; // Expecting documentId and departments array in the request body

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
      return res.status(400).json({
        message: "Document ID is required to update.",
      });
    }

    // Update the departments array for the given documentId
    const updateResult = await collection.updateOne(
      { _id: documentId },
      {
        $set: { departments: departments }, // Update the departments field
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(404).json({
        message: "No document found with the provided document ID.",
      });
    }

    res.status(200).json({
      message: "Document updated successfully",
      updateResult,
    });
  } catch (error) {
    console.log("Error in updateDepartment function:", error.message);
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
