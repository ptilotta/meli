// ===========================================================================
//   Examen BackEnd Mercadolibre 
//   Autor : Pablo Tilotta
//   Descripción : Se configura un RestServer que responderá a peticiones
//                 GET y POST, con 2 servicios configurados para evaluar
//                 una matriz de valores de ADN posibles, determinando 
//                 si corresponde a un Mutante o a un Humano. 
//                 Se programa el alojamiento de datos en MONGODB alojada
//                 en el servicio gratuito MLAB, y se sube el proyecto NODE 
//                 a HEROKU, además de publicar en GITHUB el proyecto.
//
//   Paquetes usados : Express, Mongoose, Body-Parser, Mongoose-Unique-Validator.
//   Período : Julio 2018
// ===========================================================================

require('../config/config.js'); // Cargo seteos de la aplicación
require('./express.js'); // Seteo los servicios