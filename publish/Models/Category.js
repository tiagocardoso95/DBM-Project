var database = require("../../database/sqlitedbm.js")("project_db.db");

class Category{
    constructor(id,name){
        
		this.id=id;
		Object.defineProperty(this, "id",{
			 enumerable: false 
		});

		this.name=name;
    }
}

Category.prototype.save = function(callback){
    if (this.id){
        database.run("UPDATE Categories SET 	category_name=?  WHERE category_id "+"=?",[this ,this.id])
    }else{
        database.run("INSERT INTO Categories (	category_name) VALUES ()",this);
    }
}

module.exports.all = Category.all = function(callback){
    database.get("SELECT * FROM Categories",[],Category,function(rows){
        callback(rows);
    });
}

module.exports.get = Category.get = function(id,callback){
    database.where("SELECT * FROM Categories WHERE category_id "+"=" + id, [], Category, function(rows){
        callback(rows);
    });
}

module.exports.delete = Category.delete = function(id,callback){
    database.run("DELETE FROM Categories WHERE category_id"+"=?", [id]);
}

module.exports.mappingDBtoObject = {
    	category_id:"id",
	category_name: "name",
}

module.exports.Category;
