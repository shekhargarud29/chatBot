async function main(req, res) {
  const { mongoConnect } = require("../../mongoConnect");
  const client = await mongoConnect();
  const db = client.db(process.env.MONGO_DB);
  const collection = db.collection(process.env.MONGO_COLLECTION);

  // to read all data from the collection
  const findResult = await collection.find({}).toArray();

  console.log("Found documents =>", findResult);
}

module.exports = {
  main,
};
