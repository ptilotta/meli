"use strict";

/* Carga Objetos */
var Mongo = require('../objects/mongo.js');
var Stats = require('../objects/stats.js');
var Mutant = require('../objects/mutant.js');
var Adn = require('../objects/adn.js');

const express = require('express');
const app = express();

//---------------------------------------------------------------------
// SERVICIO STATS - Devuelve estadísticas de los Mutantes/Humanos
//---------------------------------------------------------------------
app.get('/stats', function(req, res) {

    var stats = new Stats;
    stats.obtengoStats();
    if (stats.error) {
        res.status(400).json(stats.mensaje);
    } else {
        res.status(200).json(stats.mensaje);
    }
});

//-----------------------------------------------------------------------
// SERVICIO MUTANT - Determina si el ADN recibido es de Mutante o Humano
//-----------------------------------------------------------------------
app.post('/mutant', function(req, res) {
    const matriz = req.body;
    let mutante = false;

    // Valido que venga un JSON con la Matriz de ADN
    if (matriz.dna === undefined) {
        return res.status(400).json({ "mensaje": "La Matriz 'dna' NO esta definida, debe enviar por POST una matriz llamada 'dna'" });
    }

    // Cargo e Inicializo el Objeto Adn
    var mADN = new Adn(matriz.dna, 4, 2, "AGTC");

    // Realizo las validaciones
    if (!mADN.validaciones()) {
        return res.status(400).json(mADN.mensajeError);
    }
    // Llamado a la función Principal, que devuelve False o True si el ADN es Mutante
    mutante = mADN.isMutant();
    console.log(`******* el ADN chequeado es ${mutante}   ********`);


    let graboMutant = () => {
        return new promisse((resolve, reject) => {
            // Graba registro en MongoDB
            console.log('*** M U T A N T ***');
            var mut = new Mutant;
            let gm = mut.graboMutant(matriz.dna, mutante);
            gm.then(() => {
                resolve(mut.mensaje);
            }, (err) => {
                reject(res.status(400).json(mut.mensaje));
            });
        });
    };

    let graboStats = () => {
        return new promisse((resolve, reject) => {
            // grabo STATS
            console.log('*** S T A T S ***');
            var stats = new Stats;
            let gs = stats.graboStats(mutante);
            gs.then(() => {
                resolve(stats.mensaje);
            }, (err) => {
                reject(res.status(400).json(stats.mensaje));
            });
        });
    };


    graboMutant().then(() => {
        graboStats();
    });

    // Envío respuesta al Navegador
    if (mutante) {
        return res.status(200).json();
    } else {
        return res.status(403).json();
    }
});

module.exports = app;