var database = require("../../database/sqlitedbm.js")("project_db.db");

class Movie{
    constructor(id,name,category,rating,cast,length){
        
		this.id=id;
		Object.defineProperty(this, "id",{
			 enumerable: false 
		});

		this.name=name;
		this.category=category;
		this.rating=rating;
		this.cast=cast;
		this.length=length;
    }
}

Movie.prototype.save = function(callback){
    if (this.id){
        database.run("UPDATE Movies SET 	movie_name=?,	movie_category=?,	movie_rating=?,	movie_cast=?,	movie_length=?  WHERE movie_id "+"=?",[this ,this.id])
    }else{
        database.run("INSERT INTO Movies (	movie_name,	movie_category,	movie_rating,	movie_cast,	movie_length) VALUES (?,?,?,?,?)",this);
    }
}

module.exports.all = Movie.all = function(callback){
    database.get("SELECT * FROM Movies",[],Movie,function(rows){
        callback(rows);
    });
}

module.exports.get = Movie.get = function(id,callback){
    database.where("SELECT * FROM Movies WHERE movie_id "+"=" + id, [], Movie, function(rows){
        callback(rows);
    });
}

module.exports.delete = Movie.delete = function(id,callback){
    database.run("DELETE FROM Movies WHERE movie_id"+"=?", [id]);
}

module.exports.mappingDBtoObject = {
    	movie_id:"id",
	movie_name: "name",
	movie_category: "category",
	movie_rating: "rating",
	movie_cast: "cast",
	movie_length: "length",
}

module.exports.Movie;
