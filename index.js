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
    generateServer();
});

app.post('/deleteFolders', (req, res) => {
    generatedserver.deleteFolders();
    res.sendStatus(200);
});

function generateServer(req, res) {
    setTimeout(function () {
        generatedserver.deleteFolders();
    }, 1000);
    setTimeout(function () {
        generatedserver.generateFolders();
    }, 2000);
    setTimeout(function () {
        generatedserver.generateClasses();
        generatedserver.generateDB();
    }, 3500);
    setTimeout(function () {
        generatedserver.generateRelationships();
    }, 4500);
    setTimeout(function () {
        generatedserver.generateAPIs();
    }, 6000);
    setTimeout(function () {
        generatedserver.genereateBackOffice();
    }, 7500);
    setTimeout(function () {
        var config = JSON.parse(fs.readFileSync('./Server/config.json'));
        var template = fs.readFileSync('./Server/server.mustache').toString();
        fs.readdir(path.resolve(config.schemaFolder), function (err, fileNames) {
            if (err) {
                console.log(err);
                return;
            }

            var constsRouting = "";
            var usingRouting = "";
            var backOfficeRouting = "";
            var backOfficeUsing = "";

            fileNames.forEach(function (fileName) {
                var schema = JSON.parse(fs.readFileSync(path.resolve(config.schemaFolder) + "/" + fileName));
                constsRouting += "const " + schema.title + "_routing = require('./Controllers/" + schema.title + "-api.js');\n";
                backOfficeRouting += "const " + schema.title + "_backOfficeRouting = require('./Controllers/" + schema.title + "-backoffice.js');\n";
                usingRouting += "app.use('/api'," + schema.title + "_routing);\n";
                backOfficeUsing += "app.use('/backoffice'," + schema.title + "_backOfficeRouting);\n";
            });

            var view = {
                port: config.port,
                routing_consts: constsRouting,
                routing_using: usingRouting,
                backoffice_routing: backOfficeRouting,
                backoffice_using: backOfficeUsing
            }

            var output = mustache.render(template, view);

            fs.writeFileSync('./publish/index.js', output);
        });
        childProcess.fork('./publish/index.js');
        generatedserver.populateGeneratedBD();
    }, 8000)
}

app.listen(8081, () => {
    console.log("Server started on port 8081!");
});