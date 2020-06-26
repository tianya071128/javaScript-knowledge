const v1 = require("./v1");

module.exports = app => {
  app.use("/v1", v1);
};
