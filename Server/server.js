var del = require('del');
var mkdirp = require('mkdirp');
var fs = require('fs');
var config = require('../Server/config');
var genClass = require('../models/generate-class');

module.exports = {
    generateClasses(){
        var schemas = Object.keys(config.schemas);
        for(var i=0; i<schemas.length; i++){
            var schema = JSON.parse(fs.readFileSync(schemas[i].path));
            genClass.generateClass(schema);
            console.log("%s"+".js generated!",schema[i].name);
        }
        
    }
}