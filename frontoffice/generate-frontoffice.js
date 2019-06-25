var mustache = require('mustache');
var fs = require("fs");
var path = require('path');
var config = require('../Server/config.json');


function generateFrontOffice(schemas,styleConfig){ 
        let schemaNames = [];
        schemas.forEach(elem => {
            schemaNames.push({name: elem.schema.title,href: "/backoffice/"+elem.schema.title});
        });
        var view = {
            schemas: schemaNames,
            title: styleConfig.websiteName ? styleConfig.websiteName : config.siteTitle,
            background: styleConfig.backgroundColor,
            menuPosition: styleConfig.menuPosition,
            menuColour: styleConfig.menuColour,
            imageLink: "../Images/"+styleConfig.image+".jpg",
        }
        
        var template = fs.readFileSync("frontoffice/frontoffice.mustache").toString();
        var output = mustache.render(template, view);
        fs.writeFileSync("publish/Controllers/frontoffice.js", output); 
}

module.exports.generateFrontOffice = generateFrontOffice;