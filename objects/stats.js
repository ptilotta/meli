// ---------------------------------------------------------------
//  Objeto para manejo de Estadisticas
// ---------------------------------------------------------------
"use strict";
const Mongo = require('../objects/mongo.js');
class Stats {
    constructor() {
        this.error = false;
        this.mensaje = {};
    }

    obtengoStats() {
        let mongoStats = new Mongo(process.env.MongoURI);
        if (mongoStats.error) {
            this.error = true;
            this.mensaje = mongoStats.mensaje;
            return;
        }

        // Seteo Schema
        mongoStats.AddSchema('STATS', process.env.SCHEMA_STATS, process.env.MSGUNIQUE);

        // Leo el primer registro de la colección

        mongoStats.FindOne();
        if (mongoStats.error) {
            this.error = true;
            this.mensaje = mongoStats.mensaje;
            return;
        }

        this.error = false;
        if (!mongoStats.mensaje) {

            // Registro no existe
            this.mensaje = process.env.SIN_REGISTROS;
            return;

        } else {

            // Registro de Stats existente

            if (mongoStats.mensaje.humanos > 0) {
                this.mensaje = {
                    'count_mutant_dna': mongoStats.mensaje.mutantes,
                    'count_human_dna': mongoStats.mensaje.humanos,
                    'ratio': `${ mongoStats.mensaje.mutantes / mongoStats.mensaje.humanos}`
                };
            } else {
                this.mensaje = {
                    'count_mutant_dna': mongoStats.mensaje.mutantes,
                    'count_human_dna': mongoStats.mensaje.humanos,
                    'ratio': `${ mongoStats.mensaje.mutantes}`
                };
            }
        }
    }

    graboStats(mutante) {
        let mongoStats = new Mongo(process.env.MongoURI);
        if (mongoStats.error) {
            this.error = true;
            this.mensaje = mongoStats.mensaje;
            return;
        }

        mongoStats.AddSchema('STATS', {
            id: { type: Number, required: [true, 'Campo ID Requerido'] },
            humanos: { type: Number, required: [true, 'Campo humanos Requerido'] },
            mutantes: { type: Number, required: [true, 'Campo mutantes Requerido'] }
        }, process.env.MSGUNIQUE);

        // Leo el registro unico de Estadisticas

        mongoStats.FindOne();
        if (!mongoStats.resultado) {

            // Si el registro no existe, crea uno
            await mongoStats.Save(process.env.REGISTRO_VACIO);
            if (mongoStats.error) {
                this.error = true;
                this.mensaje = mongoStats.mensaje;
                return;
            }
        }
        if (mutante) {
            mongoStats.Update(process.env.SUMA_MUTANTES);
        } else {
            mongoStats.Update(process.env.SUMA_HUMANOS);
        }
        if (mongoStats.error) {
            this.error = true;
            this.mensaje = mongoStats.mensaje;
        }
    }
}

module.exports = Stats;