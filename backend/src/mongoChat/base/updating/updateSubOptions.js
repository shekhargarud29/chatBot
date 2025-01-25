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

    // Validate required fields in the request body
    if (!rootOption || !targetOption || !action || !updateData) {
      return res.status(400).json({
        message: `Missing required fields. Ensure 'rootOption', 'targetOption', 'action' and 'updateData' are provided.`,
      });
    }

    // Validate the action
    const validActions = ["addSubOptions"];
    if (!validActions.includes(action)) {
      console.log(`Invalid action: ${action}`);
      return res.status(400).json({
        message: `Invalid action: '${action}'. Valid actions are ${validActions.join(
          ", "
        )}.`,
      });
    }

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

      // check for values that alreday exists
      function recursion(newSubOptions) {
        // console.log("recursion entered");
        if (newSubOptions && newSubOptions.length > 0) {
          message = "";
          for (let i = 0; i < newSubOptions.length; i++) {
            function isDuplicate(existingSubOptions, newSubOption) {
              // console.log(object);

              for (const existingOption of existingSubOptions) {
                if (existingOption.option === newSubOption.option) {
                  return (message = `The value '${newSubOption.option}' in newSubOptions already matches an existing option under the root '${rootOption}'. Kindly consider providing a different value.`);
                  // return true;
                } else if (
                  existingOption.sub_options &&
                  existingOption.sub_options.length > 0
                ) {
                  if (isDuplicate(existingOption.sub_options, newSubOption)) {
                    return message;
                  }
                }
              }
              return false;
            }
            if (document && document.option === newSubOptions[i].option) {
              return (message = `The value '${newSubOptions[i].option}' in newSubOptions already matches an existing option under the root '${rootOption}'. Kindly consider providing a different value.`);
            }
            const val = isDuplicate(document.sub_options, newSubOptions[i]);
            if (val) {
              console.log("Duplicate found");
              return message;
            } else if (
              newSubOptions[i].sub_options &&
              newSubOptions[i].sub_options.length > 0
            ) {
              if (recursion(newSubOptions[i].sub_options)) {
                // console.log("recursion call");
                return message;
              }
            }
          }
          return false;
        }
      }
      if (recursion(updateData.newSubOptions)) {
        return message;
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
        // console.log("function called");
        if (!Array.isArray(document) && document.option === targetOption) {
          // console.log("function entered");
          // console.log(document);
          switch (action) {
            case "addSubOptions":
              // console.log("inside suboption");

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
