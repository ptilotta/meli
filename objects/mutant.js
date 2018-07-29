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
        console.log(mutante);
        let mongoMutant = new Mongo(process.env.MongoURI);
        mongoMutant.Connect().then(() => {
            if (mongoMutant.error === true) {
                this.error = true;
                this.mensaje = mongoMutant.mensaje;
                return;
            }

            // Seteo Schema MUTANT
            mongoMutant.AddSchema('MUTANT', {
                dna: { type: String, required: [true, 'Campo dna Requerido'] },
                mutante: { type: Boolean, required: [true, 'Campo mutante Requerido'] }
            }, process.env.MSGUNIQUE).then(() => {

                // Grabo los datos en la Base de Datos
                mongoMutant.Save({
                    dna: adn,
                    mutante
                }).then(() => {
                    if (mongoMutant.error === true) {
                        console.log('Dio Error mongoMutant.Save !!!', this.mensaje);
                        this.error = true;
                        this.mensaje = mongoMutant.mensaje;
                        return;
                    }
                });
            });
        });

        this.error = false;
        this.mensaje = {};
    }
}

module.exports = Mutant;