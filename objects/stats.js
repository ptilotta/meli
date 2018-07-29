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

        console.log('Voy a conectar');
        let mongoStats = await new Mongo(process.env.MongoURI);
        await mongoStats.Connect();
        if (mongoStats.error) {
            console.log(`conectar dio error ${mongoStats.error}`);
            this.error = true;
            this.mensaje = mongoStats.error;
            return;
        };

        // Seteo Schema
        console.log('Voy a AddSchema');
        await mongoStats.AddSchema('STATS', {
            id: { type: Number, required: [true, 'Campo ID Requerido'] },
            humanos: { type: Number, required: [true, 'Campo humanos Requerido'] },
            mutantes: { type: Number, required: [true, 'Campo mutantes Requerido'] }
        }, process.env.MSGUNIQUE);

        // Leo el primer registro de la colección
        console.log('Voy a FindOne');
        await mongoStats.FindOne();
        if (mongoStats.error) {
            console.log(`FindOne dio error ${mongoStats.error}`);

            this.error = true;
            this.mensaje = mongoStats.error;
            return;
        };

        // Chequeo si había registro de Totales ya creado
        console.log('Voy a Chequear mongoStats.mensaje');
        if (!mongoStats.mensaje) {
            this.error = false;

            // Registro no existe
            console.log('envio VACIO');
            this.mensaje = {
                'count_mutant_dna': 0,
                'count_human_dna': 0,
                'ratio': 0
            };
        } else {

            // Registro de Stats existente
            if (mongoStats.mensaje.humanos > 0) {
                console.log(`envio humanos + mutantes ( mutantes = ${mongoStats.mensaje.mutantes}, humanos = ${mongoStats.mensaje.humanos}) `);
                this.mensaje = {
                    'count_mutant_dna': mongoStats.mensaje.mutantes,
                    'count_human_dna': mongoStats.mensaje.humanos,
                    'ratio': `${ mongoStats.mensaje.mutantes / mongoStats.mensaje.humanos}`
                };
            } else {
                console.log(`envio humanos + mutantes ( mutantes = ${mongoStats.mensaje.mutantes}) `);
                this.mensaje = {
                    'count_mutant_dna': mongoStats.mensaje.mutantes,
                    'count_human_dna': mongoStats.mensaje.humanos,
                    'ratio': `${ mongoStats.mensaje.mutantes}`
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