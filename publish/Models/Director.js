var database = require("../database/sqlitedbm.js")("../publish/Database/project_db.db");

class Director{
    constructor(id,name,dateOfBirth,moviesDirected){
        
		this.id=id;
		Object.defineProperty(this, "id",{
			 enumerable: true 
		});

		this.name=name;
		this.dateOfBirth=dateOfBirth;
		Object.defineProperty(this, "dateOfBirth",{
			 enumerable: true 
		});

		this.moviesDirected=moviesDirected;
    }
}

Director.prototype.save = function(callback){
    if (this.id){
        database.run("UPDATE Directors SET 	director_name=?,	director_dateOfBirth=?,	director_moviesDirected=?  WHERE director_id "+"=?",[this ,this.id])
    }else{
        database.run("INSERT INTO Directors (	director_name,	director_dateOfBirth,	director_moviesDirected) VALUES (?,?,?)",this);
    }
}

module.exports.all = Director.all = function(callback){
    database.get("SELECT * FROM Directors",[],Director,function(rows){
        callback(rows);
    });
}

module.exports.get = Director.get = function(id,callback){
    database.where("SELECT * FROM Directors WHERE director_id "+"=" + id, [], Director, function(rows){
        callback(rows);
    });
}

module.exports.delete = Director.delete = function(id,callback){
    database.run("DELETE FROM Directors WHERE director_id"+"=?", [id]);
}

module.exports.mappingDBtoObject = Director.mappingDBtoObject = {
    	director_id:"id",
	director_name: "name",
	director_dateOfBirth: "dateOfBirth",
	director_moviesDirected: "moviesDirected",
}

module.exports.Director;
