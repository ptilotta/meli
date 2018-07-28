// ---------------------------------------------------------------
//  Objeto para manejo de Mutantes
// ---------------------------------------------------------------
"use strict";
var Mongo = require('../objects/mongo.js');

class Mutant {
    constructor() {
        this.error = false;
        this.mensaje = {};
    }

    async graboMutant(adn, mutante) {
        let mongoMutant = new Mongo;
        await mongoMutant.Connect(process.env.MongoURI);
        if (mongoMutant.error) {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
            return;
        }

        // Seteo Schema MUTANT

        mongoMutant.AddSchema('MUTANT', process.env.SCHEMA_MUTANT, process.env.MSGUNIQUE);

        // Grabo los datos en la Base de Datos

        mongoMutant.Save({
            adn,
            mutante
        });

        if (mongoMutant.error) {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
            return;
        }

        this.error = false;
        this.mensaje = {};
    }
}

module.exports = Mutant;