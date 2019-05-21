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

        var classProps = Object.keys(schema.properties);
        var requiredProps = schema.required;
        console.log(classProps);

        var tableContent = function(){
            var content = "";

            classProps.forEach(key =>{
                

            });
        }




        //var output = mustache.render(template.toString(), schema);
        //db.run(output);

        //close db connection
        db.close((err)=>{
            if(err){
                return console.error(err.message);
            }
        });
    }
}