var del = require('del');
var mkdirp = require('mkdirp');
var fs = require('fs');
var config = require("./config");
var genClass = require('../models/generate-class');
var path = require("path");
var dbGenerator = require('../database/generate-database');
var actorSchema = require("../schemas/actor-schema.json"); 

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
    generateDB(){
        //dbGenerator.generate(config.dbName,actorSchema);

        fs.readdir(path.resolve(config.schemaFolder),function(err,fileNames){
            if(err){
                console.log(err);
                return;
            }
            fileNames.forEach(function(fileName){
                var schema = JSON.parse(fs.readFileSync(path.resolve(config.schemaFolder)+"/"+fileName));
                
                console.log(schema);
                
                dbGenerator.generate(config.dbName,schema);
            });

        });
    
        console.log("generated Database: "+ config.dbName);
    }
}