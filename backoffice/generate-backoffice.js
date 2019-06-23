var mustache = require('mustache');
var fs = require("fs");
var path = require('path');
var config = require('../Server/config.json');

function generateBackOffice(schemas){ 
    schemas.forEach(schema => {
        var required = "[";
        for(var i=0; i<schema.schema.required.length; i++){
            if(i === schema.schema.required.length-1){
                required += "'"+schema.schema.required[i]+"']"
            }else{
                required += "'"+schema.schema.required[i]+"',"
            }
        }
        var view = {
            schemas: schemas,
            columns: required
        }
    
        var template = fs.readFileSync("backoffice/backoffice.mustache").toString();
        var output = mustache.render(template, view);
        fs.writeFileSync("publish/Controllers/backoffice.js", output);
    });
}

module.exports.generateBackOffice = generateBackOffice;