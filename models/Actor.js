var database = require("../database/sqlitedbm.js")("../publish/Database/project_db.db");

class Actor{
    constructor(id,name,dateOfBirth){
        
		this.id=id;
		Object.defineProperty(this, "id",{
			 enumerable: true 
		});

		this.name=name;
		this.dateOfBirth=dateOfBirth;
		Object.defineProperty(this, "dateOfBirth",{
			 enumerable: true 
		});

    }
}

Actor.prototype.save = function(callback){
    if (this.id){
        database.run("UPDATE Actors SET 	actor_name=?,	actor_dateOfBirth=?  WHERE actor_id "+"=?",[this ,this.id])
    }else{
        database.run("INSERT INTO Actors (	actor_name,	actor_dateOfBirth) VALUES (?,?)",this);
    }
}

module.exports.all = Actor.all = function(callback){
    database.get("SELECT * FROM Actors",[],Actor,function(rows){
        callback(rows);
    });
}

module.exports.get = Actor.get = function(id,callback){
    database.where("SELECT * FROM Actors WHERE actor_id "+"=" + id, [], Actor, function(rows){
        callback(rows);
    });
}

module.exports.delete = Actor.delete = function(id,callback){
    database.run("DELETE FROM Actors WHERE actor_id"+"=?", [id]);
}

module.exports.mappingDBtoObject = Actor.mappingDBtoObject = {
    	actor_id:"id",
	actor_name: "name",
	actor_dateOfBirth: "dateOfBirth",
}

module.exports.Actor;
