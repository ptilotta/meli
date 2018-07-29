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

        this.error = false;
        this.mensaje = {};

        console.log('1. Inicio GraboMutant');
        let mongoMutant = new Mongo(process.env.MongoURI);
        mongoMutant.Connect().then(() => {

            console.log('2. Terminó de hacer el Connect()');

            // Seteo Schema MUTANT
            console.log('3. Voy a crear el Schema MUTANT');
            mongoMutant.AddSchema('MUTANT', {
                dna: { type: String, required: [true, 'Campo dna Requerido'] },
                mutante: { type: Boolean, required: [true, 'Campo mutante Requerido'] }
            }, process.env.MSGUNIQUE).then(() => {

                // Grabo los datos en la Base de Datos
                console.log('4. Antes de ir a Save');
                mongoMutant.Save({ dna: adn, mutante }).then(() => {
                    console.log('5. Despues de ir a Save');
                    resolve(this.mensaje);
                });
            });
        }).catch((err) => {
            this.error = true;
            this.mensaje = mongoMutant.mensaje;
            resolve(this.mensaje);
        });
    }
}

module.exports = Mutant;