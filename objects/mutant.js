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
        return new promisse((resolve, reject) => {

            console.log('1. Inicio GraboMutant');
            let mongoMutant = new Mongo(process.env.MongoURI);
            mongoMutant.Connect().then(() => {

                console.log('2. Terminó de hacer el Connect()');

                // Seteo Schema MUTANT
                console.log('3. Voy a crear el Schema MUTANT');
                let addSchema = mongoMutant.AddSchema('MUTANT', {
                    dna: { type: String, required: [true, 'Campo dna Requerido'] },
                    mutante: { type: Boolean, required: [true, 'Campo mutante Requerido'] }
                }, process.env.MSGUNIQUE);

                addSchema.then(() => {

                    // Grabo los datos en la Base de Datos
                    console.log('4. Antes de ir a Save');
                    let grabar = mongoMutant.Save({ dna: adn, mutante });
                    grabar.then(() => {
                        console.log('5. Despues de ir a Save');
                        this.error = false;
                        this.mensaje = {};
                        resolve(this.mensaje);
                    }, (err) => {
                        this.error = true;
                        this.mensaje = mongoMutant.mensaje;
                        resolve(err);
                    })
                });
            });
        });
    }
}

module.exports = Mutant;