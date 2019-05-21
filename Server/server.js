var del = require('del');
var mkdirp = require('mkdirp');
var fs = require('fs');
var config = require("./config");
var genClass = require('../models/generate-class');
var path = require("path");
var dbGenerator = require('../database/generate-database');
var actorSchema = require("../schemas/actor-schema.json"); 

module.exports = {
    generateClasses(){
        var schemas = Object.keys(config.schemas);
        for(var i=0; i<schemas.length; i++){
            var schema = JSON.parse(fs.readFileSync(schemas[i].path));
            genClass.generateClass(schema);
            console.log("%s"+".js generated!",schema[i].name);
        }
        
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