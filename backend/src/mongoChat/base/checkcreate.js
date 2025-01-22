async function main(req, res) {
  const { rootOption, targetOption, option, updateData } = req.body;

  console.log("target is: ", targetOption);

  const { mongoConnect } = require("../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection("check");

    async function modifyNestedOption(
      rootOption,
      targetOption,
      action,
      updateData
    ) {
      // Step 1: Find the document by root option
      const document = await collection.findOne({ option: rootOption });
      if (!document) {
        console.log("Root option not found");
        return;
      }

      // Step 2: Recursive function to find and modify the target option
      function modifySubOption(subOptions) {
        for (let i = 0; i < subOptions.length; i++) {
          if (subOptions[i].option === targetOption) {
            switch (action) {
              case "updateName":
                subOptions[i].option = updateData.newName;
                break;
              case "updateAnswer":
                subOptions[i].answer = updateData.newAnswer;
                break;
              case "addSubOptions":
                subOptions[i].sub_options.push(...updateData.newSubOptions);
                break;
              case "removeOption":
                subOptions.splice(i, 1);
                break;
              default:
                console.log("Invalid action");
            }
            return true; // Stop searching once we find and modify the target
          } else if (
            subOptions[i].sub_options &&
            subOptions[i].sub_options.length > 0
          ) {
            if (modifySubOption(subOptions[i].sub_options)) return true; // Recursive call
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
              break;
            case "updateAnswer":
              //   console.log("updating");
              document.answer = updateData.newAnswer;
              break;
            case "addSubOptions":
              document.sub_options.push(...updateData.newSubOptions);
              break;
            case "removeOption":
              console.log("removing");
              await collection.deleteOne({ _id: document._id });
              break;
            default:
              console.log("Invalid action");
          }
          return true;
        }
        return false;
      }

      // Apply the modification

      // Step 3: Update the document in the database
      if (rootOption === targetOption) {
        modifyRootOption(document);
        // console.log("doing : ", document);
        await collection.updateOne({ _id: document._id }, { $set: document });
        foundResult = await collection
          .aggregate([{ $match: { option: document.option } }])
          .toArray();
      } else {
        modifySubOption(document.sub_options);
        // console.log("doing suboption");
        await collection.updateOne(
          { _id: document._id },
          { $set: { sub_options: document.sub_options } }
        );
        foundResult = await collection
          .aggregate([{ $match: { option: rootOption } }])
          .toArray();
      }
      console.log("Modification complete");
      return true;
    }

    // const result = await modifyNestedOption(
    //   "MCA",
    //   "Eligibility Criteria",
    //   "updateName",
    //   {
    //     newName: "Eligible",
    //   }
    // );

    // const result = await modifyNestedOption(
    //   "MCA",
    //   "Additional Info",
    //   "updateAnswer",
    //   {
    //     newAnswer: "this field is been updated",
    //   }
    // );

    // const result = await modifyNestedOption(
    //   "IT",
    //   "Course Duration",
    //   "removeOption"
    // );

    // const result = await modifyNestedOption(
    //   "MCA",
    //   "Eligibility Criteria",
    //   "addSubOptions",
    //   {
    //     newSubOptions: [
    //       {
    //         option: "Additional Info",
    //         answer: "Check the official site.",
    //         sub_options: [],
    //       },
    //     ],
    //   }
    // );
    // console.log(result);

    let foundResult = [];
    const result = await modifyNestedOption(
      rootOption,
      targetOption,
      option,
      updateData
    );
    if (result) {
      console.log("result ", result);
    }
    console.log("FOUNdRes: ", foundResult);
    res.status(200).json({
      // message: "Document readed successfully",
      message: result
        ? "Document read successfully, item found"
        : "Document read successfully, but item not found",

      foundResult: foundResult,
    });
  } catch (error) {
    console.log("Error in main function:", error.message);
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
