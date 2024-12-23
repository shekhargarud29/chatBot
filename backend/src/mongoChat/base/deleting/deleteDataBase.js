async function main(req, res) {
  //   const { databaseName } = req.body; // Expecting the database name from the request body
  const databaseName = process.env.MONGO_DB;

  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(databaseName); // Use the provided database name

    if (!databaseName) {
      throw new Error("Please enter the database name.");
    }

    // Drop the entire database
    const dropResult = await db.dropDatabase();

    if (dropResult) {
      res.status(200).json({
        message: `Database '${databaseName}' deleted successfully.`,
      });
    } else {
      res.status(404).json({
        message: `No database found with the name '${databaseName}'.`,
      });
    }
  } catch (error) {
    console.log("Error in deleteDatabase function:", error.message);
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
