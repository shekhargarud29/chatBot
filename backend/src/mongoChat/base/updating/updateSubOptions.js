async function main(req, res) {
  // const { documentId, departments } = req.body; // Expecting documentId and departments array in the request body
  const { rootOption, targetOption, action, updateData } = req.body;

  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);

    async function modifyNestedOption(
      rootOption,
      targetOption,
      action,
      updateData
    ) {
      let message = "";
      // Step 1: Find the document by root option
      const document = await collection.findOne({ option: rootOption });
      if (!document) {
        console.log("Root option not found");
        return (message = `Unable to find {RootOption: ${rootOption}} in {collection: ${process.env.MONGO_COLLECTION}}`);
      }

      function isDuplicate(existingSubOptions, newSubOption) {
        for (const existingOption of existingSubOptions) {
          console.log("newsuboption.option= ", newSubOption.option);
          console.log("existingSubOption.option= ", existingOption.option);
          if (existingOption.option === newSubOption.option) {
            return true;
          }
          if (
            existingOption.sub_options &&
            newSubOption.sub_options &&
            newSubOption.sub_options.length > 0
          ) {
            // Check each nested sub-option for duplicates
            for (const nestedNewSubOption of newSubOption.sub_options) {
              if (isDuplicate(existingOption.sub_options, nestedNewSubOption)) {
                return true;
              }
            }
          }
        }
        return false;
      }
      // ModifySubOption updated logic for nested duplicates
      function modifySubOption(subOptions) {
        for (let i = 0; i < subOptions.length; i++) {
          if (subOptions[i].option === targetOption) {
            switch (action) {
              case "addSubOptions":
                if (
                  !updateData.newSubOptions ||
                  !Array.isArray(updateData.newSubOptions)
                ) {
                  return "Invalid newSubOptions format.";
                }
                console.log("before value: ", subOptions[i].sub_options);
                const duplicateExists = updateData.newSubOptions.some(
                  (newSubOption) =>
                    isDuplicate(subOptions[i].sub_options, newSubOption)
                );
                console.log("duplicateExists: ", duplicateExists);
                if (duplicateExists) {
                  return `One or more options in newSubOptions already exist in ${rootOption}.`;
                }

                subOptions[i].sub_options.push(...updateData.newSubOptions);
                return `Sub-options successfully added to ${targetOption}.`;

              default:
                return "Invalid action.";
            }
          } else if (
            subOptions[i].sub_options &&
            subOptions[i].sub_options.length > 0
          ) {
            const response = modifySubOption(subOptions[i].sub_options);
            if (response) return response;
          }
        }
        return false;
      }

      // Function for modifying root
      async function modifyRootOption(document) {
        console.log("function called");
        if (!Array.isArray(document) && document.option === targetOption) {
          console.log("function entered");
          console.log(document);
          switch (action) {
            case "addSubOptions":
              console.log("inside suboption");
              // if (
              //   Array.isArray(document.sub_options) &&
              //   document.sub_options.length > 0
              // ) {
              //   console.log("duplicate");
              //   const duplicateExists = updateData.newSubOptions.some(
              //     (newItem) =>
              //       document.sub_options.some(
              //         (oldItem) => oldItem.option === newItem.option
              //       )
              //   );

              //   if (duplicateExists) {
              //     return (message = `Inside ${targetOption}, the new sub-options {${updateData.newSubOptions
              //       .map((opt) => opt.option)
              //       .join(", ")}} already exist.`);
              //   }
              // }
              document.sub_options.push(...updateData.newSubOptions);
              return (message = `RootOption ${targetOption} sub-options is been updated.`);

            default:
              console.log("Invalid action");
              message = "invalid action";
          }
          return message;
        }
        return false;
      }

      // Apply the modification

      // Step 3: Update the document in the database
      if (rootOption === targetOption) {
        const response = modifyRootOption(document);
        // console.log("doing : ", document);
        await collection.updateOne({ _id: document._id }, { $set: document });
        foundResult = await collection
          .aggregate([{ $match: { option: document.option } }])
          .toArray();
        return response;
      } else {
        const response = modifySubOption(document.sub_options);
        // console.log("doing suboption");
        console.log("response is: ", response);
        await collection.updateOne(
          { _id: document._id },
          { $set: { sub_options: document.sub_options } }
        );
        foundResult = await collection
          .aggregate([{ $match: { option: rootOption } }])
          .toArray();
        return response;
      }
    }

    let foundResult = [];
    const result = await modifyNestedOption(
      rootOption,
      targetOption,
      action,
      updateData
    );
    console.log(result);
    res.status(200).json({
      // message: "Document readed successfully",
      message: result
        ? result
        : `unable to find {sub_options: ${targetOption}} in ${rootOption}`,

      foundResult: foundResult,
    });
  } catch (error) {
    console.log("Error in updateDepartment function:", error.message);
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
