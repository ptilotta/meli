// -------------------------------------------------------
//  Puerto de RestServer - Heroku
// -------------------------------------------------------

// Si HEROKU no asigna un puerto se asume el puerto 3000

process.env.PORT = process.env.PORT || 3000;

// --------------------------------------------------------
//   Conexión a MONGODB
// --------------------------------------------------------

const mongoose = require('mongoose');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

urlDB = process.env.MongoURI;
process.env.URLDB = urlDB;

console.log('Antes de Connect de Mongoose');
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos ONLINE');
})