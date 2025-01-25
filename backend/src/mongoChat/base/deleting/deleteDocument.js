async function main(req, res) {
  // const { documentId } = req.body; // Expecting the documentId from the request body
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
    if (!rootOption || !targetOption || !action) {
      return res.status(400).json({
        message: `Missing required fields. Ensure 'rootOption', 'targetOption', and 'action' are provided.`,
      });
    }

    // Validate the action
    const validActions = [
      "undoOption",
      "removeOptionTemporarily",
      "removeOptionPermanently",
    ];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        message: `Invalid action: '${action}'. Valid actions are ${validActions.join(
          ", "
        )}.`,
      });
    }

    async function modifyNestedOption(
      rootOption,
      targetOption,
      action
      // updateData
    ) {
      // Step 1: Find the document by root option
      const document = await collection.findOne({ option: rootOption });
      if (!document) {
        console.log("Root option not found");
        return (message = `Unable to find {RootOption: ${rootOption}} in {collection: ${process.env.MONGO_COLLECTION}}`);
      }

      // Step 2: Recursive function to find and modify the target option
      function modifySubOption(subOptions) {
        for (let i = 0; i < subOptions.length; i++) {
          // console.log("i is:", i);
          if (subOptions[i].option === targetOption) {
            let message = "";
            switch (action) {
              case "undoOption":
                subOptions[i].isVisible = true;
                return (message = `${targetOption} is now visible`);
              case "removeOptionTemporarily":
                subOptions[i].isVisible = false;
                return (message = `${targetOption} is now hidden`);
              case "removeOptionPermanently":
                subOptions.splice(i, 1);
                break;
              default:
                message = "Invalid action value.";
            }
            return message; // Stop searching once we find and modify the target
          } else if (
            subOptions[i].sub_options &&
            subOptions[i].sub_options.length > 0
          ) {
            const response = modifySubOption(subOptions[i].sub_options);
            // console.log(response);
            if (response) return response;
          }
        }
        return false;
        // return "Target not found in this level"; // Target not found in this level
      }

      // Function for modifying root
      async function modifyRootOption(document) {
        if (!Array.isArray(document) && document.option === targetOption) {
          let message = "";

          switch (action) {
            case "undoOption":
              document.isVisible = true;
              return (message = `${document.option} is now visible.`);

            case "removeOptionTemporarily":
              document.isVisible = false;
              return (message = `${document.option} is now hidden.`);

            case "removeOptionPermanently":
              await collection.deleteOne({ _id: document._id });
              break;

            default:
              message = "Invalid action value.";
          }

          await collection.updateOne({ _id: document._id }, { $set: document });
          return message;
        }
      }

      // Apply the modification

      // Step 3: Update the document in the database
      if (rootOption === targetOption) {
        const response = await modifyRootOption(document); // Ensure await here
        await collection.updateOne(
          { _id: document._id },
          { $set: { isVisible: document.isVisible } }
        );
        foundResult = await collection.find({ option: rootOption }).toArray();
        return response;
      } else {
        const response = modifySubOption(document.sub_options);
        // console.log("doing suboption");
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
      action
      // updateData
    );
    console.log("result is: ", result);
    res.status(200).json({
      // message: "Document readed successfully",
      message: result
        ? result
        : `unable to find {sub_options: ${targetOption}} in ${rootOption}`,

      foundResult: foundResult,
    });
  } catch (error) {
    console.log("Error in deleteDocument function:", error.message);
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
