var del = require('del');
var mkdirp = require('mkdirp');
var fs = require('fs');
var config = require("./config");
var genClass = require('../models/generate-class');

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
        dbGenerator.generate(config.dbName,actorSchema);
        console.log("generated Database: "+ config.dbName);
    }
}