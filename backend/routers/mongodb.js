module.exports = function (app) {
  // creating apis
  app.post("/src/mongoChat/base/creating/createDoc/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/creating/createDoc");
    x.main(req, res);
  });
  app.post(
    "/src/mongoChat/base/creating/createDepartment/",
    function (req, res) {
      x = require(__dirname +
        "./../src/mongoChat/base/creating/createDepartment");
      x.main(req, res);
    }
  );
  app.post(
    "/src/mongoChat/base/creating/createMainOption/",
    function (req, res) {
      x = require(__dirname +
        "./../src/mongoChat/base/creating/createMainOption");
      x.main(req, res);
    }
  );
  app.post(
    "/src/mongoChat/base/creating/createSubOption/",
    function (req, res) {
      x = require(__dirname +
        "./../src/mongoChat/base/creating/createSubOption");
      x.main(req, res);
    }
  );

  // deleting apis
  app.post("/src/mongoChat/deleteChat/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/deleteChat");
    x.main(req, res);
  });

  // reading apis
  app.get("/src/mongoChat/base/reading/readDb/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/reading/readDb");
    x.main(req, res);
  });
  app.get("/src/mongoChat/base/reading/readDoc/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/reading/readDoc");
    x.main(req, res);
  });
  app.get("/src/mongoChat/base/reading/readDepartment/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/reading/readDepartment");
    x.main(req, res);
  });
  app.get("/src/mongoChat/base/reading/readMainOption/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/reading/readMainOption");
    x.main(req, res);
  });
  app.get("/src/mongoChat/base/reading/readSubOPtion/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/reading/readSubOPtion");
    x.main(req, res);
  });

  // updating apis
  app.post("/src/mongoChat/updateChat/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/updateChat");
    x.main(req, res);
  });
};
