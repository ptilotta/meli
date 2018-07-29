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

    async graboStats(mutante) {
        console.log(' ********************* INICIO DE GRABOSTATS *************************** ');
        let mongoStats = await new Mongo(process.env.MongoURI);
        await mongoStats.Connect().then(() => {
            if (mongoStats.error) {
                this.error = true;
                this.mensaje = mongoStats.mensaje;
                return;
            }
            await mongoStats.AddSchema('STATS', {
                id: { type: Number, required: [true, 'Campo ID Requerido'] },
                humanos: { type: Number, required: [true, 'Campo humanos Requerido'] },
                mutantes: { type: Number, required: [true, 'Campo mutantes Requerido'] }
            }, process.env.MSGUNIQUE).then(() => {

                // Leo el registro unico de Estadisticas
                await mongoStats.FindOne().then(() => {
                    let registros = Object.keys(mongoStats.resultado).length;
                    console.log(`Registros de FindOne ${registros}`);
                    if (registros === 0) {

                        // Si el registro no existe, crea uno
                        await mongoStats.Save({
                            id: 1,
                            humanos: 0,
                            mutantes: 0
                        }).then(() => {
                            if (mongoStats.error) {
                                this.error = true;
                                this.mensaje = mongoStats.mensaje;
                                return;
                            }
                            if (mutante) {
                                await mongoStats.Update({
                                    id: 1,
                                    $inc: { mutantes: 1 }
                                });
                            } else {
                                await mongoStats.Update({
                                    id: 1,
                                    $inc: { humanos: 1 }
                                });
                            }
                        });
                    } else {
                        if (mutante) {
                            await mongoStats.Update({
                                id: 1,
                                $inc: { mutantes: 1 }
                            });
                        } else {
                            await mongoStats.Update({
                                id: 1,
                                $inc: { humanos: 1 }
                            });
                        }

                    }
                    console.log(' ********************* FIN DE GRABOSTATS *************************** ');

                });

            });

        });


    }
}

module.exports = Stats;