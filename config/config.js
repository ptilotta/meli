const mongoose = require('mongoose');

// -------------------------------------------------------
//  Puerto de RestServer - Heroku
// -------------------------------------------------------

// Si HEROKU no asigna un puerto se asume el puerto 3000

process.env.PORT = process.env.PORT || 3000;

// Define el mensaje de error para campos UNIQUE 

process.env.MSGUNIQUE = { message: 'ValidationError: dna:' };

// Define el Schema para el servicio Stats

process.env.SCHEMA_STATS = {
    id: { type: Number, required: [true, 'Campo ID Requerido'] },
    humanos: { type: Number, required: [true, 'Campo humanos Requerido'] },
    mutantes: { type: Number, required: [true, 'Campo mutantes Requerido'] }
};

process.env.SIN_REGISTROS = {
    'count_mutant_dna': 0,
    'count_human_dna': 0,
    'ratio': 0
};

process.env.REGISTRO_VACIO = {
    id: 1,
    humanos: 0,
    mutantes: 0
};

// Define el Schema para el servicio Mutants

process.env.SCHEMA_MUTANT = {
    dna: { type: String, required: [true, 'Campo dna Requerido'], unique: true },
    mutante: { type: Boolean, required: [true, 'Campo mutante Requerido'] }
};

process.env.SUMA_HUMANOS = {
    id: 1,
    $inc: { humanos: 1 }
};
process.env.SUMA_MUTANTES = {
    id: 1,
    $inc: { mutantes: 1 }
};