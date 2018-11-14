const fs = require("fs");
const readline = require("readline");
const stream = require("stream");
const axios = require('axios');
const files=["earthquakes.csv","heatmap.csv","scatterplot.csv"];
const remote="https://raw.githubusercontent.com/kuldeepkeshwar/deck-gl-demo-app-server/master/src/data/";

function fetchFile(errorCb,file,successCb){
  axios(`${remote}${file}`).then(function (response) {
    if (response.status == 200) {
        fs.writeFileSync("/tmp/"+file,response.data)
        console.log("created file:",file);
        successCb();
    }else{
      errorCb(response);
      console.log("error in building cache",response);
    }
  })
}
module.exports = function(req, res) {
    const filename=req.params.name;
    console.log(`starting streaming ${filename}`)
    const filePath=`/tmp/${filename}`;
    if (fs.existsSync(filePath)) {
      const instream = fs.createReadStream(filePath);
      instream.on("error", function(err) {
          console.log(err);
          res.send(500);
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
          console.log(err);
          res.send(500);
      });
    }else{
      fetchFile(null,filename,function(){
        const instream = fs.createReadStream(filePath);
        instream.on("error", function(err) {
            console.log(err);
            res.send(500);
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
            console.log(err);
            res.send(500);
        });
      })
    } 
  }