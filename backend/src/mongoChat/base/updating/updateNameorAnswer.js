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
        message: `Missing required fields. Ensure 'rootOption', 'targetOption', and 'action' are provided.`,
      });
    }

    // Validate the action
    const validActions = ["updateName", "updateAnswer"];
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

      // Find the document by root option
      const document = await collection.findOne({ option: rootOption });
      if (!document) {
        console.log("Root option not found");
        return (message = `Unable to find {RootOption: ${rootOption}} in {collection: ${process.env.MONGO_COLLECTION}}`);
      }

      // check if target option exists in the document
      function alreadyExists(document) {
        console.log("new name: ", updateData.newName);
        if (document.option == updateData.newName) {
          console.log("alreday exists at root level");
          return true;
        }
        function recursive(suboptions) {
          // console.log("rescursive call");
          for (let i = 0; i < suboptions.length; i++) {
            console.log("recursive i is: ", i);
            console.log("suboptions.option: ", suboptions[i].option);
            console.log("updateData.newName: ", updateData.newName);
            if (suboptions[i].option === updateData.newName) {
              console.log("exists at sub level");
              return true;
            } else if (
              suboptions[i].sub_options &&
              suboptions[i].sub_options.length > 0
            ) {
              if (recursive(suboptions[i].sub_options)) return true;
            }
          }
          return false;
        }
        if (document.sub_options.length > 0) {
          if (recursive(document.sub_options)) return true;
        }
        return false;
      }
      if (alreadyExists(document)) {
        return (message = `Option = {${updateData.newName}} already exists in ${rootOption}`);
      }
      // ModifySubOption
      function modifySubOption(subOptions) {
        for (let i = 0; i < subOptions.length; i++) {
          // console.log("i is: ", i);
          if (subOptions[i].option === targetOption) {
            switch (action) {
              case "updateName":
                subOptions[i].option = updateData.newName;
                return (message = `SubOption = {${targetOption}} name has been changed to ${updateData.newName}.`);
              case "updateAnswer":
                subOptions[i].answer = updateData.newAnswer;
                return (message = `SubOption = {${targetOption}} answer is been updated.`);

              default:
                console.log("Invalid action");
                message = "invalid action";
            }
            return message; // Stop searching once we find and modify the target
          } else if (
            subOptions[i].sub_options &&
            subOptions[i].sub_options.length > 0
          ) {
            // if (modifySubOption(subOptions[i].sub_options)) return true; // Recursive call
            const response = modifySubOption(subOptions[i].sub_options);
            console.log(response);
            if (response) return response;
          }
        }
        return false; // Target not found in this level
      }

      // ModifyRootOption
      async function modifyRootOption(document) {
        console.log("function called");
        if (!Array.isArray(document) && document.option === targetOption) {
          console.log("function entered");
          console.log(document);
          switch (action) {
            case "updateName":
              document.option = updateData.newName;
              return (message = `RootOption = {${targetOption}} name has been changed to ${updateData.newName}.`);
            case "updateAnswer":
              //   console.log("updating");
              document.answer = updateData.newAnswer;
              return (message = `RootOption = {${targetOption}} answer is been updated.`);

            default:
              console.log("Invalid action");
              message = "invalid action";
          }
          return message;
        }
        return false;
      }

      // Apply the modification and Update the document in the database
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
        // console.log("response is: ", response);
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
      console.log("Closing database connection.");
      await client.close();
    }
  }
}

module.exports = {
  main,
};
