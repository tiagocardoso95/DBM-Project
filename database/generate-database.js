var fs = require('fs')
var mustache = require('mustache');
var sqlite3 = require('sqlite3');
module.exports = {
    generate(dbName,schema){
        
        
        //open db connection
        var db = new sqlite3.Database('./publish/Database/'+dbName,function(err){
            if(err){
                console.log(err.message);
            }
        });
        
        var template = fs.readFileSync("./database/create-table.mustache").toString();

        var classProps = schema.properties;
        var requiredProps = schema.required;
        //console.log(classProps);

        var content = "";
        for(var prop in classProps){
            content += classProps[prop].columnName + " "+convertType(classProps[prop].type)+" ";
            if(prop === "id"){
                content+= "PRIMARY KEY";
            }
            
            content +=",";
        }
        content = content.substring(0,content.length-1);
        console.log(content);

        var view = {
            classTitle: schema.table,
            tableContents: content
        }

        var output = mustache.render(template.toString(), view);
        db.run(output);

        //close db connection
        db.close((err)=>{
            if(err){
                return console.error(err.message);
            }
        });
    },
    populate(dbName,table,data){
        //open db connection
        var db = new sqlite3.Database('./publish/Database/'+dbName,function(err){
            if(err){
                console.log(err.message);
            }
        });

        db.run("INSERT INTO Actors (actor_name,actor_dateOfBirth) VALUES (?,?)",['teste1','data-anos']);
    }
}

function convertType(type){
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