const express = require("express");
const app = express();
var fs = require('fs');
var mustache = require('mustache');
var childProcess = require('child_process');
var sqlite = require("sqlite3");
var generatedserver = require('./Server/server');
var path = require('path');
var async = require('async');

app.use(express.static('public'));

app.post('/startServer', (req, res) => {
    startGeneration();
    res.sendStatus(200);
});

app.listen(8081, () => {
    console.log("Server started on port 8081!");
});

function startUpGeneratedServer() {
    var config = JSON.parse(fs.readFileSync('./Server/config.json'));
    var template = fs.readFileSync('./Server/server.mustache').toString();
    fs.readdir(path.resolve(config.schemaFolder), function (err, fileNames) {
        if (err) {
            console.log(err);
            return;
        }

        var constsRouting = "";
        var usingRouting = "";
        var backOfficeRouting = "const backOffice = require('./Controllers/backoffice.js');";
        var backOfficeUsing = "app.use('/backoffice',backOffice);";

        fileNames.forEach(function (fileName) {
            var schema = JSON.parse(fs.readFileSync(path.resolve(config.schemaFolder) + "/" + fileName));
            constsRouting += "const " + schema.title + "_routing = require('./Controllers/" + schema.title + "-api.js');\n";
            usingRouting += "app.use('/api'," + schema.title + "_routing);\n";
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
}

function startGeneration() {
    console.log("Generation started...")
    async.parallel({
            deleteFolders: function (callback) {
                setTimeout(async () => {
                    await generatedserver.deleteFolders();
                    callback(null);
                },500);
            },
            generateFolders: function (callback) {
                setTimeout(async () => {
                    await generatedserver.generateFolders();
                    callback(null);
                },1000);
            },
            generateClassAndDB: function (callback) {
                setTimeout(async () => {
                    await generatedserver.generateClasses();
                    await generatedserver.generateDB();
                    callback(null);
                },1500);
            },
            generateDBRelationships: function (callback) {
                setTimeout(async () => {
                    await generatedserver.generateRelationships();
                    callback(null);
                },2500);
            },
            copyStaticFiles: function (callback){
                setTimeout(async () => {
                    await generatedserver.copyStaticFiles();
                    callback(null);
                },3000);
            },
            generateAPIS: function (callback) {
                setTimeout(async () => {
                    await generatedserver.generateAPIs();
                    callback(null);
                },3500);
            },
            genereateBackOffice: function (callback) {
                setTimeout(async () => {
                    await generatedserver.generateBackOffice();
                    callback(null);
                },4500);
            },
            startServer: function (callback) {
                setTimeout(async () => {
                    await startUpGeneratedServer();
                    callback(null);
                },5000);
            },     
        },
        function (err, results) {
            console.log("Generation ended...")
        });

}