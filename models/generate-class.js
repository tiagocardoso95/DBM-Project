const mustache = require("mustache");
var fs = require('fs');
var config = require("../Server/config");

function generateClass(schema) {
    var classProps = Object.keys(schema.properties);
    var requiredProps = schema.required;
    var view = {
        classTitle: schema.title,
        classProperties: classProps.join(),
        classConstructor: function () {
            var props = "";
            classProps.forEach(key => {
                props += "\n\t\tthis." + key + "=" + key + ";";

                if (!requiredProps.includes(key))
                    props += "\n\t\tObject.defineProperty(this, \"" + key + "\",{\n\t\t\t enumerable: false \n\t\t});\n";
            });
            return props;
        },
        dbName: config.dbName,
        table: schema.table,
        primaryKey: classProps["id"].columnName
    }
    var template = fs.readFileSync("models/class.mustache").toString();
    var output = mustache.render(template, view);
    fs.writeFileSync("publish/Models/" + view.classTitle + ".js", output);
}

module.exports.generateClass = generateClass;