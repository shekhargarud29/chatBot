async function main(req, res) {
  const { mongoConnect } = require("../../mongoConnect");
  const client = await mongoConnect();
  const db = client.db(process.env.MONGO_DB);
  const collection = db.collection(process.env.MONGO_COLLECTION);

  // to push single element
  // const updateResult = await collection.updateOne(
  //   { _id: 1 },
  //   { $push: { main_options: { b: 1 } } }
  // );

  // // to update particular elememt or add more value inside it
  const updateResult = await collection.updateOne(
    { _id: 1, "data.main_options.option": "Admissions Process" },
    {
      $push: {
        "data.main_options.$.sub_options": {
          option: "Eligibility Criteria",
          document_link:
            "https://yourserver.com/docs/MCA_Eligibility_Criteria.pdf",
        },
      },
    }
  );

  // to push multiple value inside document
  // const updateResult = await collection.updateOne(
  //   { _id: 1 },
  //   {
  //     $push: {
  //       main_options: {
  //         $each: [{ d: 3 }, { e: 4 }],
  //       },
  //     },
  //   }
  // );

  console.log("Updated documents =>", updateResult);
}

module.exports = {
  main,
};
