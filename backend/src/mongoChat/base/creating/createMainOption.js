async function main(req, res) {
  const { department_name, main_options, documentId } = req.body;
  console.log(main_options);

  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    if (!main_options) {
      throw new Error("Main_options is not present.");
    }

    // Add a New Department:

    const insertResult = await Promise.all(
      main_options.map(async (main_option) => {
        const { option_id, option, sub_options } = main_option;

        // Check if the option already exists in the specified department
        const existingOption = await collection.findOne({
          _id: documentId,
          "departments.department_name": department_name,
          "departments.main_options.option": option,
        });

        if (existingOption) {
          // If the option exists, skip insertion
          console.log(`Option "${option}" already exists, skipping insertion.`);
          return {
            acknowledged: false,
            message: `Option ${option} already exists.`,
          };
        } else {
          // Prepare the new main option object
          const newMainOption = {
            id: option_id,
            option: option,
            sub_options: sub_options,
          };

          // Insert the new main option into the department
          const result = await collection.updateOne(
            { _id: documentId, "departments.department_name": department_name },
            { $push: { "departments.$.main_options": newMainOption } }
          );
          return result;
        }
      })
    );
    if (insertResult.every((result) => result.acknowledged)) {
      res.status(200).json({
        message: "Document inserted successfully",
        insertResult,
      });
    } else {
      res.status(200).json({
        message: "Document could not be inserted completely",
        insertResult,
      });
    }
    //   end here
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
