async function main(req, res) {
  const { department_name, main_options_id, sub_options, documentId } =
    req.body;

  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    if (!sub_options) {
      throw new Error("sub_options is not present.");
    }
    var count = 1;
    // Add a New Department:
    async function recursive(
      count,
      department_name,
      main_options_id,
      documentId,
      sub_options
    ) {
      // Use Promise.all to handle asynchronous operations
      console.log(sub_options);
      return await Promise.all(
        sub_options.map(async (sub_option) => {
          const { option, document_data } = sub_option;

          let optionString = "departments.main_options.sub_options.option";
          let subOptionString = "departments.$.main_options.sub_options";
          for (let i = 1; i < count; i++) {
            optionString += `.sub_options${1}.option`;
          }
          console.log(optionString);
          // Check if the option already exists in the specified department
          const existingOption = await collection.findOne({
            _id: documentId,
            "departments.department_name": department_name,
            "departments.main_options.option": main_options_id,
            [optionString]: option,
          });

          if (existingOption) {
            // If the option exists, skip insertion
            console.log(
              `Sub_option "${option}" already exists, skipping insertion.`
            );
            return {
              acknowledged: false,
              message: `Sub_option ${option} already exists.`,
            };
          } else {
            // Handle nested sub_options recursively
            // if (sub_option.sub_options) {
            //   // Recursive call for nested sub_options
            //   // const nestedResult = await recursive(
            //   //   department_name,
            //   //   main_options_id,
            //   //   documentId,
            //   //   sub_option.sub_options
            //   // );
            //   const newParentSubOption = {
            //     option: option,
            //     document_data: document_data,
            //     // sub_options: [], // Include resolved nested sub-options
            //   };

            //   // console.log(departments.main_options.id);
            //   const result1 = await collection.updateOne(
            //     {
            //       _id: documentId,
            //       "departments.department_name": department_name,
            //       "departments.main_options.id": main_options_id,
            //     },
            //     {
            //       $push: {
            //         [subOptionString]: newParentSubOption,
            //       },
            //     }
            //   );
            //   count = count + 1;
            //   // let subOptionString = "departments.$.main_options.sub_options";
            //   for (let i = 1; i < count; i++) {
            //     subOptionString += `.sub_options${1}`;
            //   }
            //   // Create the parent object and include nested sub-options
            //   // const newChildSubOption = nestedResult; // Include resolved nested sub-options
            //   // console.log(newChildSubOption);

            //   // Insert the new sub-option into MongoDB
            //   // const result = await collection.updateOne(
            //   //   {
            //   //     _id: documentId,
            //   //     "departments.department_name": department_name,
            //   //     "departments.main_options.id": main_options_id,
            //   //   },
            //   //   {
            //   //     $push: {
            //   //       [subOptionString]: newChildSubOption,
            //   //     },
            //   //   }
            //   // );

            //   if (result1.acknowledged) {
            //     console.log(
            //       `Inserted new sub-option "${option}" with nested sub-options.`
            //     );
            //     return newParentSubOption; // Return the newly created object
            //   }
            // } else {
            // Prepare and return the new sub-option
            const newSubOption = {
              option: option,
              document_data: document_data,
            };
            console.log("Inserting:", newSubOption);
            // Simulate database insertion (you can replace this with your DB logic)
            const result = await collection.updateOne(
              {
                _id: documentId,
                "departments.department_name": department_name,
                "departments.main_options.option": main_options_id,
              },
              {
                $push: {
                  // [subOptionString]: newSubOption,
                  "departments.$.main_options.sub_options": newSubOption,
                },
              }
            );

            if (result.acknowledged) {
              console.log(`Inserted new sub-option "${option}".`);
              return newSubOption; // Return the inserted object
            }
            // }
          }
        })
      );
    }

    // Example usage:
    const insertResult = await recursive(
      count,
      department_name,
      main_options_id,
      documentId,
      sub_options
    );
    console.log("Insert Result:", insertResult);

    // const insertResults = function recursive() {};
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
