// ---------------------------------------------------------------
//  configuramos nuestro Schema de la tabla ADN
// ---------------------------------------------------------------

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let adnSchema = new Schema({
    adn: { type: String, unique: true, required: [true, 'Campo ADN Requerido'] },
    mutante: { type: Boolean, required: [true, 'El valor de Mutante es requerido'] }
})
adnSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('ADN', adnSchema);