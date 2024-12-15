async function main(req, res) {
  const { documentId, departments } = req.body;
  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    if (!documentId && departments) {
      throw new Error("Please enter a document ID or mention departments.");
    }

    // to find single document with id

    const findResult = await collection
      .aggregate([
        {
          $match: { _id: documentId },
        },
        {
          $project: {
            departments: {
              $filter: {
                input: "$departments",
                as: "department",
                cond: { $in: ["$$department.department_name", departments] },
              },
            },
          },
        },
      ])
      .toArray();

    res.status(200).json({
      message: "Department readed successfully",
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
