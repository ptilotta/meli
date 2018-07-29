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
        return new promisse((resolve, reject) => {

            let mongoStats = new Mongo(process.env.MongoURI);
            mongoStats.Connect().then(() => {

                // Seteo Schema
                let ad = mongoStats.AddSchema('STATS', process.env.SCHEMA_STATS, process.env.MSGUNIQUE);
                ad.then(() => {
                    // Leo el primer registro de la colección

                    let fo = mmongoStats.FindOne();
                    fo.then(() => {
                        this.error = false;
                        if (!mongoStats.mensaje) {

                            // Registro no existe
                            this.mensaje = process.env.SIN_REGISTROS;
                            resolve(this.mensaje);

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
                            resolve(this.mensaje);
                        }
                    }, (err) => {
                        this.error = true;
                        this.mensaje = mongoStats.mensaje;
                        reject(this.mensaje);
                    });
                }, (err) => {
                    this.error = true;
                    this.mensaje = mongoStats.mensaje;
                    reject(this.mensaje);
                });
            }, (err) => {
                this.error = true;
                this.mensaje = mongoStats.mensaje;
                reject(this.mensaje);
            });
        })
    };

    graboStats(mutante) {
        return new promisse((resolve, reject) => {
            console.log(' ********************* INICIO DE GRABOSTATS *************************** ');
            let mongoStats = new Mongo(process.env.MongoURI);
            let connect = mongoStats.Connect();
            connect.then(() => {
                let ad = mongoStats.AddSchema('STATS', {
                    id: { type: Number, required: [true, 'Campo ID Requerido'] },
                    humanos: { type: Number, required: [true, 'Campo humanos Requerido'] },
                    mutantes: { type: Number, required: [true, 'Campo mutantes Requerido'] }
                }, process.env.MSGUNIQUE);
                ad.then(() => {

                    // Leo el registro unico de Estadisticas
                    let fo = mongoStats.FindOne();
                    fo.then(() => {
                        let registros = Object.keys(mongoStats.resultado).length;
                        console.log(`Registros de FindOne ${registros}`);
                        if (registros === 0) {

                            // Si el registro no existe, crea uno
                            let sa = mongoStats.Save({ id: 1, humanos: 0, mutantes: 0 });
                            sa.then(() => {
                                if (mutante) {
                                    let up = mongoStats.Update({ id: 1, $inc: { mutantes: 1 } });
                                } else {
                                    let up = mongoStats.Update({ id: 1, $inc: { humanos: 1 } });
                                }
                            }, (err) => {
                                this.error = true;
                                this.mensaje = mongoStats.mensaje;
                                reject(this.mensaje);
                            });

                        } else {
                            if (mutante) {
                                let up = mongoStats.Update({ id: 1, $inc: { mutantes: 1 } });
                            } else {
                                let up = mongoStats.Update({ id: 1, $inc: { humanos: 1 } });
                            }
                        }
                        console.log(' ********************* FIN DE GRABOSTATS *************************** ');
                    }, (err) => {
                        this.error = true;
                        this.mensaje = mongoStats.mensaje;
                        reject(this.mensaje);
                    });
                }, (err) => {
                    this.error = true;
                    this.mensaje = mongoStats.mensaje;
                    reject(this.mensaje);
                });
            });
        });
    };
}

module.exports = Stats;