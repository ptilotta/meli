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

        let procesar = async() => {
            console.log('1. Inicio GraboMutant');
            let mongoMutant = await new Mongo(process.env.MongoURI);
            await mongoMutant.Connect();

            console.log('2. Terminó de hacer el Connect()');
            if (mongoMutant.error === true) {
                this.error = true;
                this.mensaje = mongoMutant.mensaje;
                return;
            }

            // Seteo Schema MUTANT
            console.log('3. Voy a crear el Schema MUTANT');
            await mongoMutant.AddSchema('MUTANT', {
                dna: { type: String, required: [true, 'Campo dna Requerido'] },
                mutante: { type: Boolean, required: [true, 'Campo mutante Requerido'] }
            }, process.env.MSGUNIQUE);

            // Grabo los datos en la Base de Datos
            console.log('4. Antes de ir a Save');
            await mongoMutant.Save({
                dna: adn,
                mutante
            });

            console.log('5. despues de Save');
            if (mongoMutant.error === true) {
                console.log('Dio Error mongoMutant.Save !!!', this.mensaje);
                this.error = true;
                this.mensaje = mongoMutant.mensaje;
                return;
            }
            console.log('6. Fin de GraboMutant');
            this.error = false;
            this.mensaje = {};
        }
        procesar().then(() => {
            console.log('SALIO POR EL THEN');
        });
    }

}

module.exports = Mutant;