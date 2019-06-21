var fs = require('fs')
var mustache = require('mustache');
var sqlite3 = require('sqlite3');
module.exports = {
    generate(dbName, schema) {


        //open db connection
        var db = new sqlite3.Database('./publish/Database/' + dbName, function (err) {
            if (err) {
                console.log(err.message);
            }
        });

        var template = fs.readFileSync("./database/create-table.mustache").toString();

        var classProps = schema.properties;
        var requiredProps = schema.required;
        //console.log(classProps);

        var content = "";
        for (var prop in classProps) {
            content += classProps[prop].columnName + " " + convertType(classProps[prop].type) + " ";
            if (prop === "id") {
                content += "PRIMARY KEY";
            }

            content += ",";
        }
        content = content.substring(0, content.length - 1);
        var view = {
            classTitle: schema.table,
            tableContents: content
        }
        var output = mustache.render(template.toString(), view);
        db.run(output);
        //close db connection
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    },
    generateRelationships(dbName, schema) {
        //open db connection
        var db = new sqlite3.Database('./publish/Database/' + dbName, function (err) {
            if (err) {
                console.log(err.message);
            }
        });
        for(let i=0; i<schema.references.length; i++){
            if (schema.references[i].relation === '1-M') {
                var template = fs.readFileSync("./database/foreignkey.mustache").toString();
                var view = {
                    tableName: schema.table,
                    columnName: schema.references[i].columnName,
                    tableToBeReferenced: schema.references[i].tableName
                }
                var output = mustache.render(template.toString(), view);
                db.run(output);
            } else if (schema.references[i].relation === 'M-M') {
                var template = fs.readFileSync("./database/jointables.mustache").toString();
                var tableName = schema.table < schema.references[i].tableName ? schema.table + '_' + schema.references[i].tableName : schema.references[i].tableName + '_' + schema.table;
                var tableContents = "" +
                    schema.properties.id.columnName +
                    " INTEGER," + schema.references[i].columnName + " INTEGER, PRIMARY KEY(" + schema.properties.id.columnName + "," +
                    schema.references[i].columnName + "),FOREIGN KEY (" + schema.references[i].columnName + ") REFERENCES " +
                    schema.references[i].tableName + "(" + schema.references[i].columnName + "),FOREIGN KEY (" + schema.properties.id.columnName + ") REFERENCES " + schema.table +
                    "(" + schema.properties.id.columnName + ")";
    
                var view = {
                    tableName: tableName,
                    tableContents: tableContents
                }
                var output = mustache.render(template.toString(), view);
                db.run(output);
            }
        }

        //close db connection
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
        });
    }
}

function convertType(type) {
    switch (type) {
        case "number":
            return "INTEGER"
            break;
        case "string":
            return "TEXT"
        default:
            return "TEXT";
    }
}