const fs = require("fs");
const readline = require("readline");
const stream = require("stream");
const cors = require('cors')
const express = require("express");
const app = express();
const port = process.env.PORT;
const request = require('request');
const files=["earthquakes.csv","heatmap.csv","scatterplot.csv"];
const remote="https://raw.githubusercontent.com/kuldeepkeshwar/deck-gl-demo-app-server/master/src/data/";

app.use(cors());

app.get('ping', (req, res) => {
  res.end('pong!!');
})
app.get("/data/:filename", function(req, res,next) {
  const filename=req.params.filename;
  console.log(`starting streaming ${filename}`)  
  const instream = fs.createReadStream(`/tmp/${filename}.csv`);
  instream.on("error", function(err) {
    next(err);
  });
  const outstream = new stream();
  const rl = readline.createInterface(instream, outstream);

  rl.on("line", function(line) {
    res.write(`${line}\n`);
  });

  rl.on("close", function() {
    console.log(`finished streaming ${filename}`)  
    res.end();
  });
  rl.on("error", function(err) {
    next(err);
  });
});
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.listen(port, (...args) => console.log(`Example app listening on port ${port}!`,...args));

files.forEach(file=>{
  console.log(`fetching : ${remote}${file}`)
  request.get(`${remote}${file}`, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        fs.writeFileSync("/tmp/"+file,body)
        console.log("created file:",file);
    }else{
      console.log("error in building cache",error,response);
    }
});
})
