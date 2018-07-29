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

        console.log('1. Inicio GraboMutant');
        let mongoMutant = new Mongo(process.env.MongoURI);
        await mongoMutant.Connect();
        if (mongoMutant.error) {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
            return;
        }
        console.log('2. Terminó de hacer el Connect()');

        // Seteo Schema MUTANT
        console.log('3. Voy a crear el Schema MUTANT');
        await mongoMutant.AddSchema('MUTANT', {
            dna: { type: String, required: [true, 'Campo dna Requerido'] },
            mutante: { type: Boolean, required: [true, 'Campo mutante Requerido'] }
        }, process.env.MSGUNIQUE);
        if (mongoMutant.error) {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
            return;
        }

        // Grabo los datos en la Base de Datos
        console.log('4. Antes de ir a Save');
        await mongoMutant.Save({ dna: adn, mutante });
        if (mongoMutant.error) {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
            return;
        }

        console.log('5. Despues de ir a Save');
        return;
    };
}


module.exports = Mutant;