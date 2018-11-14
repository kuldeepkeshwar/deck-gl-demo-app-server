const cors = require('cors')
const express = require("express");
const file = require("../api/file");
const ping = require("../api/ping");
const app = express();
const port = process.env.PORT;

app.use(cors());

app.get('ping', ping)
app.get("/data/:name", file);
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(port, (...args) => console.log(`Example app listening on port ${port}!`,...args));
