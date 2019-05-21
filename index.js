const express = require("express");
const app = express();
var fs = require('fs');
var mustache = require('mustache');
var childProcess = require('child_process');
var sqlite = require("sqlite3");
var generatedserver = require('./Server/server');

var Actor = require("./models/Actor");

app.use(express.static('public'));

app.post('/startServer', (req, res) => {
    var config = JSON.parse(fs.readFileSync('./Server/config.json'));
    var template = fs.readFileSync('./Server/server.mustache').toString();

    var output = mustache.render(template, (config));

    fs.writeFileSync('./publish/index.js', output);

    childProcess.fork('./publish/index.js');
    res.sendStatus(200);
});

app.post('/deleteFolders', (req, res) => {
    generatedserver.deleteFolders();
    res.sendStatus(200);
});

app.post('/generateFolders', (req, res) => {
    generatedserver.generateFolders();
    res.sendStatus(200);
});

app.get("/insertActor",(req,res) =>{
    var db = new sqlite.Database("publish/Database/project_db.db");
    db.run("INSERT INTO Actors (actor_name,actor_dateOfBirth) VALUES (?,?)",['teste1','data-anos']);
    res.send("OK");
});

app.get("/Actors",(req,res) =>{
    var db = new sqlite.Database("publish/Database/project_db.db");
    db.all("SELECT * FROM Actors",function(err,rows){
        console.log(rows);
    });
    res.send("OK");
});

app.get("/ActorsC",(req,res) =>{
    Actor.delete(1,function(rows){
        console.log(rows);
    });
});

app.post('/generateClassAndDB', (req, res) => {
    generatedserver.generateClasses();
    generatedserver.generateDB();
    res.sendStatus(200);
});

app.post('/generateAPIs', (req, res) => {
    generatedserver.generateAPIs();
    res.sendStatus(200);
});

app.get("/tables",(req,res)=>{
    var db = new sqlite.Database("publish/Database/project_db.db");


    db.serialize(function () {
        db.all("select name from sqlite_master where type='table'", function (err, tables) {
            console.log(tables);
        });
    });
});

app.listen(8081, () => {
    console.log("Server started on port 8081!");
});