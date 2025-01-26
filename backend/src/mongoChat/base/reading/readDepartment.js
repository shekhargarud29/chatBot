async function main(req, res) {
  const { rootOption } = req.body;
  const { mongoConnect } = require("../../mongoConnect");
  let client;

  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);

    // Check if documentId and department_name are provided
    if (!rootOption) {
      throw new Error("Please provide a rootOption.");
    }

    // Find the document by ID
    const findResult = await collection
      .aggregate([
        {
          $match: { option: rootOption }, // Match document by its _id
        },
      ])
      .toArray();

    console.log("Find Result before filter:", findResult); // Debug log

    // Check if document exists
    if (findResult.length === 0) {
      return res.status(404).json({
        message: "No document found with the provided document ID.",
      });
    }

    res.status(200).json({
      message: "Department retrieved successfully",
      findResult: findResult,
    });
  } catch (error) {
    console.log("Error in main function:", error.message);
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
