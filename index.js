const express = require("express");
const app = express();
var fs = require('fs');
var mustache = require('mustache');
var childProcess = require('child_process');
var sqlite = require("sqlite3");
var generatedserver = require('./Server/server');
var path = require('path');

app.use(express.static('public'));

app.post('/startServer', (req, res) => {
    var config = JSON.parse(fs.readFileSync('./Server/config.json'));
    var template = fs.readFileSync('./Server/server.mustache').toString();

    fs.readdir(path.resolve(config.schemaFolder), function (err, fileNames) {
        if (err) {
            console.log(err);
            return;
        }

        var constsRouting = "";
        var usingRouting = "";
    
        fileNames.forEach(function (fileName) {
            var schema = JSON.parse(fs.readFileSync(path.resolve(config.schemaFolder) + "/" + fileName));
            constsRouting += "const " + schema.title + "_routing = require('./Controllers/" + schema.title + "-api.js');\n";
            usingRouting += "app.use('/api'," + schema.title + "_routing);\n";
        });

        var view = {
            port: config.port,
            routing_consts: constsRouting,
            routing_using: usingRouting,
        }

        var output = mustache.render(template, view);

        fs.writeFileSync('./publish/index.js', output);
    });
    childProcess.fork('./publish/index.js');
    generatedserver.populateGeneratedBD();
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

app.post('/generateAPIs', (req, res) => {
    generatedserver.generateAPIs();
    res.sendStatus(200);
});

app.listen(8081, () => {
    console.log("Server started on port 8081!");
});