const mustache = require("mustache");
var fs = require('fs');
var path = require("path");
var config = require("../Server/config");
function generateClass(schema) {
    var classProps = Object.keys(schema.properties);
    var requiredProps = schema.required;
    var columns = "";
    var update = "";
    var map = "";
    var questionMarks = "";
    var dbProps = [];
    var foreignkey = schema.references;

    for(var prop in schema.properties){
        if(prop ==="id"){
            map += "\t"+schema.properties.id.columnName+':"id",\n';
            continue;
        }
        questionMarks += "?,";
        map += "\t"+schema.properties[prop].columnName+': "'+prop.toString()+'",\n';
        columns += "\t"+schema.properties[prop].columnName+",";
        update += "\t"+schema.properties[prop].columnName+"="+"?,";
        dbProps.push('this.'+prop);
    }
    columns = columns.substring(0,columns.length-1);
    update = update.substring(0,update.length-1);
    map = map.substring(0,map.length-1);
    questionMarks = questionMarks.substring(0,questionMarks.length-1)
    
    if(foreignkey){
        for(var i=0; i<foreignkey.length; i++){
            if(foreignkey[i].relation === '1-M'){
                var propToAdd = foreignkey[i].columnName;
                classProps.push(propToAdd);
                columns += ","+propToAdd;
                questionMarks += ",?";
                update += ", "+propToAdd+"=?";
                map += "\n"+propToAdd+": "+"'"+ propToAdd+"'";
            }
        }
    };


    var view = {
        classTitle: schema.title,
        classProperties: classProps.join(),
        classConstructor: function () {
            var props = "";
            classProps.forEach(key => {
                props += "\n\t\tthis." + key + "=" + key + ";";

                if (!requiredProps.includes(key))
                    props += "\n\t\tObject.defineProperty(this, \"" + key + "\",{\n\t\t\t enumerable: true \n\t\t});\n";
            });
            return props;
        },
        dbName: "../Database/"+config.dbName,
        table: schema.table,
        primaryKey: schema.properties.id.columnName,
        columns: columns,
        update: update,
        map: map,
        questionMarks: questionMarks,
        dbProps: dbProps,
    }
    var template = fs.readFileSync("models/class.mustache").toString();
    var output = mustache.render(template, view);
    fs.writeFileSync("publish/Models/" + view.classTitle + ".js", output);
}

module.exports.generateClass = generateClass;