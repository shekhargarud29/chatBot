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

      // Step 2: Recursive function to find and modify the target option
      function modifySubOption(subOptions) {
        for (let i = 0; i < subOptions.length; i++) {
          console.log("i is: ", i);
          if (subOptions[i].option === targetOption) {
            switch (action) {
              case "updateName":
                subOptions[i].option = updateData.newName;
                return (message = `SubOption ${targetOption} name has been changed to ${updateData.newName}.`);
              case "updateAnswer":
                subOptions[i].answer = updateData.newAnswer;
                return (message = `SubOption ${targetOption} answer is been updated.`);
              case "addSubOptions":
                subOptions[i].sub_options.push(...updateData.newSubOptions);
                return (message = `SubOption ${targetOption} sub-options is been updated.`);

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

      // Function for modifying root
      async function modifyRootOption(document) {
        console.log("function called");
        if (!Array.isArray(document) && document.option === targetOption) {
          console.log("function entered");
          console.log(document);
          switch (action) {
            case "updateName":
              document.option = updateData.newName;
              return (message = `RootOption ${targetOption} name has been changed to ${updateData.newName}.`);
            case "updateAnswer":
              //   console.log("updating");
              document.answer = updateData.newAnswer;
              return (message = `RootOption ${targetOption} answer is been updated.`);
            case "addSubOptions":
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
