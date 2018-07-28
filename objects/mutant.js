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

    graboMutant(adn, mutante) {
        let mongoMutant = new Mongo(process.env.MongoURI);
        if (mongoMutant.error === true) {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
            return;
        }

        // Seteo Schema MUTANT

        mongoMutant.AddSchema('MUTANT', {
            dna: { type: String, required: [true, 'Campo dna Requerido'] },
            mutantes: { type: Boolean, required: [true, 'Campo mutante Requerido'] }
        }, process.env.MSGUNIQUE);

        // Grabo los datos en la Base de Datos
        console.log('Estoy aquí a punto de entrar en mongoMutant.Save');
        mongoMutant.Save({
            adn,
            mutante
        });

        if (mongoMutant.error === true) {
            console.log('Dio Error mongoMutant.Save !!!', this.mensaje);
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
            return;
        }

        this.error = false;
        this.mensaje = {};
    }
}

module.exports = Mutant;