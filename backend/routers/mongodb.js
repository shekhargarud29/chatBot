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
  app.post("/src/mongoChat/base/deleting/deleteChat", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/deleting/deleteChat");
    x.main(req, res);
  });
  app.post(
    "/src/mongoChat/base/deleting/deleteCollection/",
    function (req, res) {
      x = require(__dirname +
        "./../src/mongoChat/base/deleting/deleteCollection");
      x.main(req, res);
    }
  );
  app.post("/src/mongoChat/base/deleting/deleteDataBase/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/deleting/deleteDataBase");
    x.main(req, res);
  });
  app.post("/src/mongoChat/base/deleting/deleteDocument/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/deleting/deleteDocument");
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
  app.get("/src/mongoChat/base/reading/readTargetOption/", function (req, res) {
    x = require(__dirname + "./../src/mongoChat/base/reading/readTargetOption");
    x.main(req, res);
  });

  // updating apis
  app.post(
    "/src/mongoChat/base/updating/updatinDepartments/",
    function (req, res) {
      x = require("./../src/mongoChat/base/updating/updatinDepartments");
      x.main(req, res);
    }
  );
  app.post("/src/mongoChat/base/updating/updateChat/", function (req, res) {
    x = require("./../src/mongoChat/base/updating/updateChat");
    x.main(req, res);
  });

  // check
  app.get("/src/mongoChat/base/check/", function (req, res) {
    x = require("../src/mongoChat/base/check");
    x.main(req, res);
  });
  // checkcreate
  app.get("/src/mongoChat/base/checkcreate/", function (req, res) {
    x = require("../src/mongoChat/base/checkcreate");
    x.main(req, res);
  });
};
