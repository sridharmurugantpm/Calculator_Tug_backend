// api/index.js
const serverless = require("serverless-http");
const app = require("../server"); // path to your exported express app

module.exports = serverless(app);
