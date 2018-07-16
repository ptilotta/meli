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

    ADN.count({ mutante: false }, (err, conteo) => {
        if (err) {
            humanos = 0;
        } else {
            humanos = conteo;
        }
    });

    // Calculo los MUTANTES 

    ADN.count({ mutante: true }, (err, conteo) => {
        if (err) {
            mutantes = 0;
        } else {
            mutantes = conteo;
        }
    });

    // Preparo mensaje JSON con la respuesta 

    todos = humanos + mutantes;
    if (humanos > 0) {
        let mensaje = {
            'count_mutant_dna': mutantes,
            'count_human_dna': humanos,
            'ratio': `${ mutantes / humanos}`
        }
    } else {
        let mensaje = {
            'count_mutant_dna': mutantes,
            'count_human_dna': humanos,
            'ratio': `${ mutantes }`
        }
    }
    return res.json(mensaje);
});
//-----------------------------------------------------------------

app.post('/mutant', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return resp.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

module.exports = app;