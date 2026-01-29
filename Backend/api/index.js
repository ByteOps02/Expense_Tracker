const app = require("../server");
const connectDB = require("../config/db");

let serverlessApp;

module.exports = async (req, res) => {
  if (!serverlessApp) {
    await connectDB();
    serverlessApp = app;
  }
  return serverlessApp(req, res);
};