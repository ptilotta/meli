const funciones = require('../funciones/funciones.js');

const express = require('express');
const ADN = require('../models/adn.js');
const app = express();


//-----------------------------------------------------------------
// SERVICIO STATS - Devuelve estadísticas de los Mutantes/Humanos
//-----------------------------------------------------------------
app.get('/stats', function(req, res) {

    let humanos = 0;
    let mutantes = 0;

    // Calculo los HUMANOS 

    ADN.find({ mutante: false }).countDocuments((err, conteo) => {
        if (err) {
            return resp.status(400).json({
                mensaje: "Error en la conexión a la BD ",
                err
            })
        } else {
            humanos = conteo;
            console.log(`humanos = ${humanos}`);

            // Calculo los MUTANTES 

            ADN.find({ mutante: true }).countDocuments((err, conteo) => {
                if (err) {
                    return resp.status(400).json({
                        mensaje: "Error en la conexión a la BD ",
                        err
                    })
                } else {
                    mutantes = conteo;
                    console.log(`mutantes = ${mutantes}`);

                    // Preparo mensaje JSON con la respuesta 

                    if (humanos > 0) {
                        var mensaje = {
                            'count_mutant_dna': mutantes,
                            'count_human_dna': humanos,
                            'ratio': `${ mutantes / humanos}`
                        }
                    } else {
                        var mensaje = {
                            'count_mutant_dna': mutantes,
                            'count_human_dna': humanos,
                            'ratio': `${ mutantes }`
                        }
                    }
                    return res.json(mensaje);
                }
            });
        }
    });
});
//-----------------------------------------------------------------

app.post('/mutant', function(req, res) {
    let matriz = req.body;
    let mutante = false;

    // Valido el JSON recibido

    if (matriz.dna == undefined) {
        return res.status(400).json({ "mensaje": "La Matriz 'dna' NO esta definida, debe enviar por POST una matriz llamada 'dna'" });
    }


    // Cargo los elementos de la matriz recibida en JSON en la tabla

    let tabla = [];

    for (var i in matriz.dna) {
        tabla.push(matriz.dna[i]);
    }

    // Chequeo la longitud heterogenea de los elementos de la tabla

    if (funciones.chequeoLongitud(tabla) === false) {
        return res.status(400).json({ "mensaje": "Los elementos de la Matriz 'dna' deben tener la misma longitud para poder formar una matriz" });
    }

    // Chequeo letras recibidas en las cadenas solo permitiendo las 4 letras válidas

    if (funciones.chequeoLetrasValidas(tabla) === false) {
        return res.status(400).json({ "mensaje": "Los elementos de la Matriz 'dna' deben contener solo los juegos de valores de las letras 'A','C','T','G'" });
    }

    // Llamado a la función Principal, que devuelve False o True si el ADN es Mutante

    mutante = funciones.isMutant(tabla);

    // Graba registro en MongoDB

    let adn = new ADN({
        adn: matriz.dna,
        mutante: mutante
    });

    adn.save((err, dnaDB) => {
        if (err) {
            if (!err.message.includes("adn debe de ser único")) {
                return res.status(400).json({ err });
            }
        }
    });

    // Devuelve el Status correcto en caso de que el ADN sea Mutante o Humano

    if (mutante) {
        return res.status(200).json();
    } else {
        return res.status(403).json();
    }
});

module.exports = app;