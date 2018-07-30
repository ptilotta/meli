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

    async obtengoStats() {

        let mongoStats = await new Mongo(process.env.MongoURI);
        await mongoStats.Connect();
        if (mongoStats.error) {
            this.error = true;
            this.mensaje = mongoStats.error;
            return;
        };

        // Seteo Schema
        await mongoStats.AddSchema('STATS', {
            id: { type: Number, required: [true, 'Campo ID Requerido'] },
            humanos: { type: Number, required: [true, 'Campo humanos Requerido'] },
            mutantes: { type: Number, required: [true, 'Campo mutantes Requerido'] }
        }, process.env.MSGUNIQUE);

        // Leo el primer registro de la colección
        await mongoStats.FindOne();
        if (mongoStats.error) {
            console.log(`FindOne dio error ${mongoStats.error}`);

            this.error = true;
            this.mensaje = mongoStats.error;
            return;
        };

        // Chequeo si había registro de Totales ya creado
        if (!mongoStats.resultado) {
            this.error = false;

            // Registro no existe
            this.mensaje = {
                'count_mutant_dna': 0,
                'count_human_dna': 0,
                'ratio': 0
            };
        } else {

            // Registro de Stats existente
            console.log(`${JSON.parse(mongoStats.resultado)}`);
            var rdo = JSON.parse(mongoStats.resultado);
            if (rdo['humanos'] > 0) {
                console.log(`envio humanos + mutantes ( mutantes = ${rdo['mutantes']}, humanos = ${rdo['humanos']}) `);
                this.mensaje = {
                    'count_mutant_dna': rdo['mutantes'],
                    'count_human_dna': rdo['humanos'],
                    'ratio': `${ rdo['mutantes'] / rdo['humanos']}`
                };
            } else {
                console.log(`envio humanos + mutantes ( mutantes = ${rdo['mutantes']}) `);
                this.mensaje = {
                    'count_mutant_dna': rdo['mutantes'],
                    'count_human_dna': rdo['mutantes'],
                    'ratio': `${ rdo['mutantes']}`
                };
            }
        }
        return;
    };

    async graboStats(mutante) {

        // Creo el objeto Mongo y conecto a la Base de Datos
        let mongoStats = await new Mongo(process.env.MongoURI);
        await mongoStats.Connect();
        if (mongoStats.error) {
            this.error = true;
            this.mensaje = mongoStats.error;
            return;
        }
        // Creo el Schema
        await mongoStats.AddSchema('STATS', {
            id: { type: Number, required: [true, 'Campo ID Requerido'] },
            humanos: { type: Number, required: [true, 'Campo humanos Requerido'] },
            mutantes: { type: Number, required: [true, 'Campo mutantes Requerido'] }
        }, process.env.MSGUNIQUE);

        // Leo el registro unico de Estadisticas
        await mongoStats.FindOne();
        if (mongoStats.error) {
            this.error = true;
            this.mensaje = mongoStats.error;
            return;
        }

        let registros = Object.keys(mongoStats.resultado).length;
        if (registros === 0) {

            // Si el registro no existe, crea uno
            if (mutante) {
                var comando = { id: 1, humanos: 0, mutantes: 1 };
            } else {
                var comando = { id: 1, humanos: 1, mutantes: 0 };
            }
            await mongoStats.Save(comando);
            if (mongoStats.error) {
                this.error = true;
                this.mensaje = mongoStats.error;
                return;
            }
        } else {

            // Si hay un registro de totales, simplemente suma 1 al campo correspondiente
            if (mutante) {
                await mongoStats.Update({ id: 1, $inc: { mutantes: 1 } });
            } else {
                await mongoStats.Update({ id: 1, $inc: { humanos: 1 } });
            }
            if (mongoStats.error) {
                this.error = true;
                this.mensaje = mongoStats.error;
                return;
            }
        }
    };
}

module.exports = Stats;