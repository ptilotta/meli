// ---------------------------------------------------------------
//  Objeto para manejo de Mutantes
// ---------------------------------------------------------------
"use strict";
var Mongo = require('../objects/mongo.js');

class Mutant {
    constructor() {
        this.error = false;
        this.mensaje = {};
        this.grabarStats = true;
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
        await mongoMutant.AddSchema('MUTANT', {
            dna: { type: String, required: [true, 'Campo dna Requerido'], unique: true },
            mutante: { type: Boolean, required: [true, 'Campo mutante Requerido'] }
        }, process.env.MSGUNIQUE);

        // Grabo los datos en la Base de Datos
        await mongoMutant.Save({ dna: adn, mutante });
        if (mongoMutant.error) {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
        } else {
            if (!mongoMutant.continue) {
                this.grabarStats = false; // no graba las Stats si en el objeto Mongo viene un continue='false'
            }
        }
        return;
    };
}

module.exports = Mutant;