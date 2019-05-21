var database = require("../database/sqlitedbm.js")("../publish/Database/project_db.db");

class Cinema{
    constructor(id,name,movies,ticketPrice){
        
		this.id=id;
		Object.defineProperty(this, "id",{
			 enumerable: true 
		});

		this.name=name;
		this.movies=movies;
		Object.defineProperty(this, "movies",{
			 enumerable: true 
		});

		this.ticketPrice=ticketPrice;
		Object.defineProperty(this, "ticketPrice",{
			 enumerable: true 
		});

    }
}

Cinema.prototype.save = function(callback){
    if (this.id){
        database.run("UPDATE Cinemas SET 	cinema_name=?,	cinema_movies=?,	movies_ticketPrice=?  WHERE category_id "+"=?",[this ,this.id])
    }else{
        database.run("INSERT INTO Cinemas (	cinema_name,	cinema_movies,	movies_ticketPrice) VALUES (?,?,?)",this);
    }
}

module.exports.all = Cinema.all = function(callback){
    database.get("SELECT * FROM Cinemas",[],Cinema,function(rows){
        callback(rows);
    });
}

module.exports.get = Cinema.get = function(id,callback){
    database.where("SELECT * FROM Cinemas WHERE category_id "+"=" + id, [], Cinema, function(rows){
        callback(rows);
    });
}

module.exports.delete = Cinema.delete = function(id,callback){
    database.run("DELETE FROM Cinemas WHERE category_id"+"=?", [id]);
}

module.exports.mappingDBtoObject = Cinema.mappingDBtoObject = {
    	category_id:"id",
	cinema_name: "name",
	cinema_movies: "movies",
	movies_ticketPrice: "ticketPrice",
}

module.exports.Cinema;
