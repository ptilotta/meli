//-------------------------------------------------------
// Conecta con la base de datos MONDODB alojada en MLAB
//-------------------------------------------------------

const mongoose = require('mongoose');

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;

urlDB = process.env.MongoURI;
process.env.URLDB = urlDB;

mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {
    if (err) {
        throw err
    };
})