async function main(req, res) {
  const { rootOption, targetOption } = req.body;
  console.log("target is: ", targetOption);
  //
  //   console.log("check working");
  //   const insertedResult = await collection.insertOne({
  //     _id,
  //     option,
  //     answer,
  //     sub_options,
  //   });
  //   console.log(insertedResult);

  const { mongoConnect } = require("../mongoConnect");
  let client;
  try {
    client = await mongoConnect();
    if (!client) {
      throw new Error("Failed to establish a database connection.");
    }
    const db = client.db(process.env.MONGO_DB);
    const collection = db.collection("check");
    // if (!documentId) {
    //   throw new Error("Please enter a document ID.");
    // }

    // to find single document with id
    // method 1
    // const foundResult = await collection
    //   .aggregate([
    //     {
    //       $group: {
    //         _id: 0,
    //         departments: {
    //           $push: "$$ROOT",
    //         },
    //         // filtered: {
    //         //   $push: {
    //         //     option: "$option",
    //         //     answer: "$answer",
    //         //   },
    //         // },
    //       },
    //     },
    //     {
    //       $project: {
    //         _id: 1,
    //         departments: 1,
    //         // filtered: 1,
    //       },
    //     },
    //   ])
    //   .toArray();
    // console.log(foundResult[0]);

    // method 2
    // let foundResult = await collection
    //   .aggregate([
    //     { $match: { _id: 1 } },
    //     {
    //       $unwind: {
    //         path: paths,
    //         preserveNullAndEmptyArrays: true,
    //       },
    //     },
    //   ])
    //   .toArray();

    async function searchNestedOption(rootOption, targetOption, paths, find) {
      let aggregatepaths = "$sub_options";
      const pipeline = [
        // Match the document by root option
        { $match: { option: rootOption } },
      ];
      console.log(count);
      for (let i = 0; i < count; i++) {
        console.log("aggregatepaths: " + aggregatepaths);
        pipeline.push({
          $unwind: {
            path: aggregatepaths,
            preserveNullAndEmptyArrays: true,
          },
        });
        aggregatepaths += ".sub_options";
      }
      if (find) {
        console.log(targetOption);
        paths += ".option";
        console.log("paths: " + paths);
        pipeline.push({
          $match: { [paths]: targetOption },
        });
      }
      const result = await collection.aggregate(pipeline).toArray();
      console.log("result: " + JSON.stringify(result));
      return result.length > 0 ? result : null;
    }
    count = 0;

    let paths = `sub_options`;
    let find = false;
    let foundResult;
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
          console.log("target for fun: ", targetOption);
          if (item?.option === targetOption) {
            find = true;
            break;
          }
          let target = paths.split(".").reduce((obj, key) => {
            // console.log(obj);
            // console.log(key);
            return obj?.[key];
          }, item);
          console.log(target);
          if (!Array.isArray(target) && target.option === targetOption) {
            find = true;
            // count = 0;
            console.log("found");
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

      if (count > 2) {
        console.log("Maximum depth reached, target option not found.");
        break;
      }
    }

    // const result = await searchNestedOption("MCA", "Admissions Process");
    if (!foundResult) {
      return res.status(404).json({
        message: `Option "${targetOption}" not found under "${rootOption}".`,
      });
    }

    res.status(200).json({
      message: "Document readed successfully",
      // message: find
      //   ? "Document read successfully, item found"
      //   : "Document read successfully, but item not found",

      foundResult: foundResult,
    });
  } catch (error) {
    console.log("Error in main function:", error.message);
    res.status(500).json({
      message: "An error occurred while processing your request.",
      error: error.message, // Optional: Include error details for debugging
    });
  }
  // finally {
  //   if (client) {
  //     await client.close();
  //   }
  // }
}

module.exports = {
  main,
};
