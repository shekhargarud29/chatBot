const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
const corsOptions = {
  origin: "http://localhost:3000/", // Replace with your client domain
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors());
// parse application/json
app.use(bodyParser.json());
require("./routers")(app);
try {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
} catch (error) {
  console.log("Unable to connect on server" + error);
}
