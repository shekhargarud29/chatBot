async function main(req, res) {
  const { documentId, department_name, main_option } = req.body;
  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    if (!documentId && !department_name && !main_option) {
      throw new Error(
        "Please enter a document ID , department name, or main option."
      );
    }

    // to find single document with id

    const findResult = await collection.findOne(
      {
        _id: documentId,
        "departments.department_name": department_name,
        "departments.main_options.option": main_option,
      },
      {
        projection: { "departments.main_options.$": 1 },
      }
    );

    res.status(200).json({
      message: "Sub_OPtion readed successfully",
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
