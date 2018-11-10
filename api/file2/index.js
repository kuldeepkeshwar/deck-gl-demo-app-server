const { parse } = require("url");
const axios = require('axios');
const files=["earthquakes.csv","heatmap.csv","scatterplot.csv"];
const remote="https://raw.githubusercontent.com/kuldeepkeshwar/deck-gl-demo-app-server/master/src/data/";

const cache={};
files.forEach(name=>{
  console.log(`fetching : ${remote}${name}`)
  axios(`${remote}${name}`).then(function (response) {
    if (response.status == 200) {
        cache[name]=response.data;
        console.log("created file:",name);
    }else{
      console.log("error in building cache",response);
    }
})});
module.exports = function(req, res) {
    const { query } = parse(req.url, true);
    const {name} = query;
    console.log(`starting streaming ${name}`)  
    if(cache[name]){
      res.end(cache[name])
    }else{
      res.send(400);
    }
  }