// -------------------------------------------------------
//  Puerto de RestServer - Heroku
// -------------------------------------------------------

// Si HEROKU no asigna un puerto se asume el puerto 3000

process.env.PORT = process.env.PORT || 3000;

// Define el mensaje de error para campos UNIQUE 

process.env.MSGUNIQUE = { message: 'ValidationError: dna:' };