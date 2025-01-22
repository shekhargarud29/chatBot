async function main(req, res) {
  //   const { documentId } = req.body;
  // const documentId = req.body.documentId || 1;
  const { rootOption, targetOption } = req.body;
  const { mongoConnect } = require("../../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection(process.env.MONGO_COLLECTION);
    if (!rootOption && !targetOption) {
      throw new Error("Please enter a RootOption and TargetOption.");
    }

    //   reading target option

    let paths = `sub_options`;
    let find = false;
    let foundResult;
    let count = 0;

    // to unwind array
    async function searchNestedOption(rootOption, targetOption, paths, find) {
      let aggregatepaths = "$sub_options";
      const pipeline = [
        // Match the document by root option
        { $match: { option: rootOption } },
      ];
      // console.log(count);
      for (let i = 0; i < count; i++) {
        // console.log("aggregatepaths: " + aggregatepaths);
        pipeline.push({
          $unwind: {
            path: aggregatepaths,
            preserveNullAndEmptyArrays: true,
          },
        });
        aggregatepaths += ".sub_options";
      }
      if (find) {
        // console.log(targetOption);
        paths += ".option";
        // console.log("paths: " + paths);
        pipeline.push({
          $match: { [paths]: targetOption },
        });
      }
      const result = await collection.aggregate(pipeline).toArray();
      // console.log("result: " + JSON.stringify(result));
      return result.length > 0 ? result : null;
    }

    // to check for targetOption
    while (!find) {
      foundResult = await searchNestedOption(
        rootOption,
        targetOption,
        paths,
        find
      );
      for (let i = 1; i < count; i++) {
        paths += `.sub_options`;
      }
      if (foundResult && foundResult.length > 0) {
        for (const item of foundResult) {
          // console.log("target for fun: ", targetOption);
          if (item?.option === targetOption) {
            console.log("TargetOption found");
            find = true;
            break;
          }
          let target = paths.split(".").reduce((obj, key) => {
            // console.log(obj);
            // console.log(key);
            return obj?.[key];
          }, item);
          // console.log(target);
          if (
            !Array.isArray(target) &&
            target?.option &&
            target.option === targetOption
          ) {
            find = true;
            // count = 0;
            console.log("TargetOption found");
            // console.log(paths);
            foundResult = await searchNestedOption(
              rootOption,
              targetOption,
              paths,
              find
            );
            break;
          }

          // console.log(target);
        }
      }
      if (!find) {
        count++;
      }

      if (count > foundResult.length) {
        console.log("TargetOption not found");
        throw new Error(
          `Maximum depth reached, unable to find {Option: ${targetOption}}.`
        );
      }
    }

    res.status(200).json({
      message: `{Option: ${targetOption}} readed successfully `,
      foundResult,
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
