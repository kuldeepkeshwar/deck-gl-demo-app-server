const cors = require('cors')
const express = require("express");
const lambda = require("./lambda");
const app = express();
const port = process.env.PORT;

app.use(cors());

app.get('ping', (req, res) => {
  res.end('pong!!');
})
app.get("/data/:filename", lambda);
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(port, (...args) => console.log(`Example app listening on port ${port}!`,...args));
