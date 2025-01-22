async function main(req, res) {
  //   const { documentId } = req.body;
  // const documentId = req.body.documentId || 1;
  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    // if (!documentId) {
    //   throw new Error("Please enter a document ID.");
    // }

    // to find single document with id
    const foundResult = await collection
      .aggregate([
        {
          $group: {
            _id: 0,
            departments: {
              $push: "$$ROOT",
            },
          },
        },
        {
          $project: {
            _id: 1,
            departments: 1,
          },
        },
      ])
      .toArray();

    res.status(200).json({
      message: "Document readed successfully",
      foundResult: foundResult[0],
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
