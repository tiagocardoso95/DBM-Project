var mustache = require('mustache');
var fs = require("fs");

function generateBackOffice(schema){
    var required = "[";
    
    for(var i=0; i<schema.required.length; i++){
        if(i === schema.required.length-1){
            required += "'"+schema.required[i]+"']"
        }else{
            required += "'"+schema.required[i]+"',"
        }
    }
        

    var view = {
        schemaName: schema.title,
        columns: required
    }

    var template = fs.readFileSync("backoffice/backoffice.mustache").toString();
    var output = mustache.render(template, view);
    fs.writeFileSync("publish/Controllers/"+schema.title+"-backoffice.js", output);
}

module.exports.generateBackOffice = generateBackOffice;