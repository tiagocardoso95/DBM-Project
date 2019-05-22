var del = require('del');
var mkdirp = require('mkdirp');
var fs = require('fs');
var config = require("./config");
var genClass = require('../models/generate-class');
var path = require("path");
var dbGenerator = require('../database/generate-database');
var apiGenerator = require('../api/generate-api');

module.exports = {
    deleteFolders() {
        del(['./publish/Controllers'], {
            force: true
        }).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'))
        });
        del(['./publish/Models'], {
            force: true
        }).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'))
        });
        del(['./publish/Public'], {
            force: true
        }).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'))
        });
        del(['./publish/Views'], {
            force: true
        }).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'))
        });
        del(['./publish/Database'], {
            force: true
        }).then(paths => {
            console.log('Deleted files and folders:\n', paths.join('\n'))
        });
        fs.unlink('./publish/index.js', (err) => {
            if (err) console.log(err);
            console.log('File index.js deleted');
        });
    },
    generateFolders() {
        mkdirp('./publish/Controllers', (err) => {
            if (err) console.log(err);
            console.log('Controllers directory created.');
        });
        mkdirp('./publish/Models', (err) => {
            if (err) console.log(err);
            console.log('Models directory created.');
        });
        mkdirp('./publish/Public/Css', (err) => {
            if (err) console.log(err);
            else console.log('css dir created')
        });
        mkdirp('./publish/Public/Images', (err) => {
            if (err) console.log(err);
            else console.log('images dir created')
        });
        mkdirp('./publish/Public/Js', (err) => {
            if (err) console.log(err);
            else console.log('js dir created')
        });
        mkdirp('./publish/Views', (err) => {
            if (err) console.log(err);
            console.log('Views directory created.');
        });
        mkdirp('./publish/Database', (err) => {
            if (err) console.log(err);
            console.log('Database directory created.');
        });
    },
    generateClasses() {
        fs.readdir(path.resolve(config.schemaFolder), function (err, fileNames) {
            if (err) {
                console.log(err);
                return;
            }
            fileNames.forEach(function (fileName) {
                var schema = JSON.parse(fs.readFileSync(path.resolve(config.schemaFolder) + "/" + fileName));
                genClass.generateClass(schema);
                console.log("%s" + ".js generated!", schema.title);
            });
        });

    },
    generateDB() {
        fs.readdir(path.resolve(config.schemaFolder), function (err, fileNames) {
            if (err) {
                console.log(err);
                return;
            }
            fileNames.forEach(function (fileName) {
                var schema = JSON.parse(fs.readFileSync(path.resolve(config.schemaFolder) + "/" + fileName));
                dbGenerator.generate(config.dbName, schema);
            });
        });
        console.log("generated Database: " + config.dbName);
    },
    generateAPIs() {
        fs.readdir(path.resolve(config.schemaFolder), function (err, fileNames) {
            if (err) {
                console.log(err);
                return;
            }
            fileNames.forEach(function (fileName) {
                var schema = JSON.parse(fs.readFileSync(path.resolve(config.schemaFolder) + "/" + fileName));
                apiGenerator.generateAPI(schema);
                console.log("API for "+schema.title+" generated!");
            });

            fs.writeFileSync(config.staticFiles[0].destinationPath+"/sqlitedbm.js",fs.readFileSync(config.staticFiles[0].originalPath));
        });
    },
    populateGeneratedBD(){
        var db = require("../publish/Database/sqlitedbm")("project_db.db");
        var populate = require("../database/populate-database.json");
        var data = JSON.parse(JSON.stringify(populate));
        var actors = data.actors;

        for(var i=0; i<actors.length; i++){
            db.run("INSERT INTO Actors(actor_name,actor_dateOfBirth) VALUES (?,?)",[actors[i].actor_name,actors[i].actor_dateOfBirth], function(err){
                if (err) {
                    return;
                  }
            });
        }
    }
}