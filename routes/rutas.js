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
    let todos = 0;

    // Calculo los HUMANOS 

    ADN.find({ mutante: false }).countDocuments((err, conteo) => {
        if (err) {
            humanos = 0;
        } else {
            humanos = conteo;
        }
    });

    // Calculo los MUTANTES 

    ADN.find({ mutante: true }).countDocuments((err, conteo) => {
        if (err) {
            mutantes = 0;
        } else {
            mutantes = conteo;
        }
    });

    // Preparo mensaje JSON con la respuesta 

    todos = humanos + mutantes;
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
});
//-----------------------------------------------------------------

app.post('/mutant', function(req, res) {
    let matriz = req.body;
    let mutante = false;

    ' Valido el JSON recibido'

    if (matriz.dna == undefined) {
        return res.status(400).json({
            "mensaje": "La Matriz 'dna' NO esta definida, debe enviar por POST una matriz llamada 'dna'"
        });
    }

    let tabla = matriz.dna.split(",");

    if (funciones.chequeoLongitud(tabla) === false) {
        return res.status(400).json({
            "mensaje": "Los elementos de la Matriz 'dna' deben tener la misma longitud para poder formar una matriz"
        });
    }

    if (funciones.chequeoLetrasValidas(tabla) === false) {
        return res.status(400).json({
            "mensaje": "Los elementos de la Matriz 'dna' deben contener solo los juegos de valores de las letras 'A','C','T','G'"
        });
    }

    mutante = funciones.isMutant(tabla);

    // Graba registro en MongoDB

    let adn = new ADN({
        adn: matriz.dna,
        mutante: mutante
    });

    adn.save((err, dnaDB) => {
        if (err) {
            console.log(`ValidationError ${err.ValidationError}`);
            let mensajeError = err.ValidationError;
            if (mensajeError.includes("adn debe de ser único")) {} else {
                console.log('Hubo error en MONGODB', err);
                return res.status(400).json({ err });
            }
            console.log(err);
        }
    });

    if (mutante) {
        return res.status(200).json();
    } else {
        return res.status(403).json();
    }
});

module.exports = app;