async function main(req, res) {
  const { mongoConnect } = require("../../mongoConnect");
  const client = await mongoConnect();
  const db = client.db(process.env.MONGO_DB);
  const collection = db.collection(process.env.MONGO_COLLECTION);

  // to delete paticular object in document
  const deleteResult = await collection.updateOne(
    { _id: 1, "data.main_options.sub_option.option": "Eligibility Criteria" },
    // {
    //   $pull: {
    //     "data.main_options.$[].sub_option": { option: "Eligibility Criteria" },
    //   },
    // }
    {
      $unset: {
        "data.main_options.$[].sub_option": { option: "Eligibility Criteria" },
      },
    }
  );

  console.log("Deleted documents =>", deleteResult);
}

module.exports = {
  main,
};
