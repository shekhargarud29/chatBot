async function main(req, res) {
  const { documentId, department_name } = req.body;
  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    if (!documentId && !department_name) {
      throw new Error("Please enter a document ID or department name.");
    }

    // to find single document with id

    const findResult = await collection.findOne(
      { _id: documentId, "departments.department_name": department_name },
      {
        projection: { "departments.$": 1 },
      }
    );

    res.status(200).json({
      message: "Main_Option readed successfully",
      findResult,
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
