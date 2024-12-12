async function main(req, res) {
  const { departments, documentId } = req.body;

  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    if (departments.length === 0) {
      throw new Error("No departments data provided.");
    }
    const insertResult = await Promise.all(
      departments.map(async (department) => {
        const { department_name, main_options } = department;

        // Check if the department already exists
        const existingDepartment = await collection.findOne({
          _id: documentId,
          "departments.name": department_name,
        });
        console.log(existingDepartment);
        if (existingDepartment) {
          // If the option exists, skip insertion
          console.log(
            `Department "${department_name}" already exists, skipping insertion.`
          );
          return { acknowledged: false, message: "Department already exists." };
        } else {
          const newDepartment = {
            department_name: department_name,
            main_options: main_options,
          };
          // Add a New Department:
          const result = await collection.updateOne(
            { _id: documentId },
            { $push: { departments: newDepartment } }
          );
          return result;
        }
      })
    );
    if (insertResult.every((result) => result.acknowledged)) {
      res.status(200).json({
        message: "Department inserted successfully",
        insertResult,
      });
    } else {
      res.status(200).json({
        message: "Department could not be inserted completely",
        insertResult,
      });
    }
  } catch (error) {
    console.log("Error in main funtion:", error.message);
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
