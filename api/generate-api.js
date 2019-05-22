var mustache = require('mustache');
var fs = require("fs");

function generateAPI(schema){

    var view = {
        schemaName: schema.title,
        schemaProps: schema.props,
    }

    var template = fs.readFileSync("api/api.mustache").toString();
    var output = mustache.render(template, view);
    fs.writeFileSync("publish/Controllers/"+schema.title+"-api.js", output);
}

module.exports.generateAPI = generateAPI;