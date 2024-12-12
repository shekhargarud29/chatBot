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
  app.get("/src/mongoChat/readChat/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/readChat");
    x.main(req, res);
  });
  app.post("/src/mongoChat/updateChat/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/updateChat");
    x.main(req, res);
  });
};
