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

    // Add a New Department:
    async function recursive(
      count,
      department_name,
      main_options_id,
      documentId,
      sub_options,
      check
    ) {
      // Use Promise.all to handle asynchronous operations

      return await Promise.all(
        sub_options.map(async (sub_option) => {
          const { option, document_data } = sub_option;
          console.log("check is ", check);
          console.log(" option is ", option);
          // Adjust path depending on nesting level
          let subOptionString =
            "departments.$.main_options.$[main].sub_options";
          let optionString = "departments.main_options.sub_options";

          for (let i = 1; i < count; i++) {
            optionString += `.sub_options`;
            subOptionString += `.$[sub].sub_options`;
          }

          optionString += ".option";

          console.log("optionString " + optionString);
          console.log("subOptionString ", subOptionString);
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
          }

          const newSubOption = {
            option: option,
            document_data: document_data,
            sub_options: [], // Include resolved nested sub-options
          };
          // Insert the new sub-option into MongoDB
          let result;
          if (check !== undefined && check !== null) {
            console.log("check wil be ", check);
            result = await collection.updateOne(
              {
                _id: documentId,
                "departments.department_name": department_name,
                "departments.main_options.id": main_options_id,
              },
              {
                $push: {
                  [subOptionString]: newSubOption,
                },
              },
              {
                arrayFilters: [
                  { "main.id": main_options_id }, // Filter for the main option
                  { "sub.option": check }, // Filter for the sub-option
                ],
              }
            );
            console.log("Inserted sub_option:", result);
          } else {
            result = await collection.updateOne(
              {
                _id: documentId,
                "departments.department_name": department_name,
                "departments.main_options.id": main_options_id,
              },
              {
                $push: {
                  [subOptionString]: newSubOption,
                },
              },
              {
                arrayFilters: [
                  { "main.id": main_options_id }, // Filter for the main option
                ],
              }
            );
            console.log("Inserted sub_option:", result);
          }

          // Handle nested sub_options recursively
          if (sub_option.sub_options && sub_option.sub_options.length > 0) {
            console.log("option is ", option);
            const check = option;
            // Recursive call for nested sub_options
            console.log("under if" + JSON.stringify(sub_option.sub_options));

            const sub_options = sub_option.sub_options;
            console.log(sub_options);
            const insertResult = await recursive(
              2,
              department_name,
              main_options_id,
              documentId,
              sub_options,
              check
            );
            console.log("insertResult " + insertResult);
            return {
              acknowledged: result.acknowledged,
              insertedOption: newSubOption,
            };
          }
          //  else {
          //   // Prepare and return the new sub-option
          //   const newSubOption = {
          //     option: option,
          //     document_data: document_data,
          //   };
          //   console.log("Inserting:", newSubOption);
          //   // Simulate database insertion (you can replace this with your DB logic)
          //   const result = await collection.updateOne(
          //     {
          //       _id: documentId,
          //       "departments.department_name": department_name,
          //       "departments.main_options.id": main_options_id,
          //     },
          //     {
          //       $push: {
          //         [subOptionString]: newSubOption,
          //         // "departments.$.main_options.$[main].sub_options":
          //         //   newSubOption,
          //       },
          //     },
          //     {
          //       arrayFilters: [{ "main.id": main_options_id }],
          //     }
          //   );
          //   console.log(result);
          //   return {
          //     acknowledged: result.acknowledged,
          //     insertedOption: newSubOption, // Include relevant data for debugging
          //   };
          // }
          return {
            acknowledged: result.acknowledged,
            insertedOption: newSubOption, // Include relevant data for debugging
          };
        })
      );
    }

    // Example usage:
    const insertResult = await recursive(
      1,
      department_name,
      main_options_id,
      documentId,
      sub_options
    );

    if (
      insertResult.every((result) => {
        return result.acknowledged;
      })
    ) {
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
