const express = require("express");
const app = express();
var fs = require('fs');
var mustache = require('mustache');
var childProcess = require('child_process');
var sqlite = require("sqlite3");
var generatedserver = require('./Server/server');

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

app.post('/generateClassAndDB', (req, res) => {
    generatedserver.generateClasses();
    generatedserver.generateDB();
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