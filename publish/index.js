const express = require('express');
const app = express();

var Actor = require("./Models/Actor");

app.get("/", function (req, res) 
{
    res.send("Hello World");
});

app.get("/Actors",function (req,res){

       Actor.all(function(err,rows){
        console.log(err);
        console.log(rows);
    });
});

app.listen(8080, () => {
    console.log("Generated Server running on port 8080!!");
});