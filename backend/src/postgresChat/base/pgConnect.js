async function pgConnector() {
  const pg = require("pg");

  const { Client } = pg;

  const client = new Client({
    user: "postgres",
    password: "root",
    host: "localhost",
    port: "5432",
    database: "student_db",
  });
  await client.connect();
  return client;
}
module.exports = {
  pgConnector,
};
