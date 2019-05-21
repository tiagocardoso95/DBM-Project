var sqlite = require('sqlite3').verbose();

/**
 * MÃ©todo que faz o mapeamento entre um objeto retornado pelo mÃ³dulo sqlite num objeto de uma classe criada
 * @param {any} object Representa o objeto retornado pela query Ã  base de dados
 * @param {any} type Representa o tipo de objeto que se pretende converter
 * @param {any} isenum Para reconfigurar o enumerable da propriedade
 * @returns Devolve um objeto do tipo "type" com o conteÃºdo que estÃ¡ no objeto "object"
 */
function mapping(object, type, isenum) {
    if (type && object) { //Se o type nÃ£o for passado como argumento devolve o prÃ³prio objeto retornado do mÃ³dulo sqlite
        var obj = new type(); //Inicializar um objeto do tipo "type"
        Object.keys(object).forEach(function (dbProp) {
            var objProp = dbProp;
            if (type.mappingDBtoObject) //Se a classe possuir um objeto de mapeamento vai se buscar esse valor para a coluna que foi retornada. Porque as propriedades dos objetos podem ter nomes diferentes da mesma coluna na tabela
                var objProp = type.mappingDBtoObject[dbProp];
            if (obj.hasOwnProperty(objProp)) { //Se o objeto possuir o atributo que se estÃ¡ a verificar entÃ£o recebe o valor retornado da query da base de dados
                obj[objProp] = object[dbProp];
				if (isenum)
                    Object.defineProperty(obj, objProp, {
                        enumerable: isenum
                    });
			}
        });
        return obj; //Devolve o objeto convertido
    }
    return object;
}

/**
 * Exportar uma funÃ§Ã£o que recebe o caminho da base de dados a ser utilizado. Quando o mÃ³dulo for utilizado deverÃ¡ ser passado o caminho para o ficheiro da base de dados e a funÃ§Ã£o retornarÃ¡ um objeto com 3 funÃ§Ãµes possÃ­veis: get, run e where
 * 
 * @param {any} dbpath 
 * @returns 
 */
module.exports = function (dbpath) {
    return {
        get: function (statement, params, type, callback) {
            var db = new sqlite.Database(dbpath);
            db.get(statement, params, function (err, row) {
                row = mapping(row, type);
                callback(row);
            });
            db.close();
        },
        run: function (statement, params, callback) {
            var db = new sqlite.Database(dbpath);
            db.run(statement, params, function (err) {
                if (callback)
                    callback({ success: !err , error: err});
            });
            db.close();
        },
        where: function (statement, params, type, callback) {
            var db = new sqlite.Database(dbpath);
            db.all(statement, params, function (err, rows) {
                rows = rows.map(function (object) {
                    return mapping(object, type);
                });
                callback(rows);
            });
            db.close();
        }
    }
}