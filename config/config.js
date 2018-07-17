// -------------------------------------------------------
//  Puerto de RestServer - Heroku
// -------------------------------------------------------

// Si HEROKU no asigna un puerto se asume el puerto 3000

process.env.PORT = process.env.PORT || 3000;

// --------------------------------------------------------
//   Conexión a MONGODB
// --------------------------------------------------------

const mongoose = require('mongoose');

let urlDB;

urlDB = process.env.MongoURI;
process.env.URLDB = urlDB;

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) throw err;
    console.log('Base de Datos ONLINE');
})