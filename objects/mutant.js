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

        this.error = false;
        this.mensaje = {};

        let mongoMutant = new Mongo(process.env.MongoURI);
        await mongoMutant.Connect();
        if (mongoMutant.error) {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
            return;
        }

        // Seteo Schema MUTANT
        /*        await mongoMutant.AddSchema('MUTANT', {
                    dna: { type: String, required: [true, 'Campo dna Requerido'], unique: true },
                    mutante: { type: Boolean, required: [true, 'Campo mutante Requerido'] }
                }, process.env.MSGUNIQUE); */

        await mongoMutant.AddSchema('MUTANT', process.env.SCHEMA_MUTANT, process.env.MSGUNIQUE);



        // Grabo los datos en la Base de Datos
        await mongoMutant.Save({ dna: adn, mutante });
        if (mongoMutant.error) {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
        }
        return;
    };
}

module.exports = Mutant;