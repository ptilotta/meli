// ---------------------------------------------------------------
//  Objeto para manejo de Base de Datos MongoDB
// ---------------------------------------------------------------

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
"use strict";
class Mongo {
    constructor() {
        this.modelo; // Se creará el Modelo de Schema
        this.status = 0; // 0 = Desconectado, 1 = Conectado
        this.mensaje = {}; // Mensaje de Error en caso de que haya uno
        this.uniqueMsg; // Mensaje para el UniqueValidator
        this.error = false; // Indica cuando hubo un error
        this.resultado = {}; // Almacena el objeto JSON resultado de los Find    
    };

    /* 
      @nombre = Nombre del Schema
      @schema = definición del Schema
      @uniqueMsg = Mensaje para el error de Unique Validator
    */
    AddSchema(nombre, schema, uniqueMsg) {

        /* Crea un Schema para este objeto */
        this.uniqueMs = uniqueMsg;
        console.log(schema);
        let sch = new Schema(schema);
        sch.plugin(uniqueValidator, { message: uniqueMsg });
        this.modelo = mongoose.model(nombre, sch);
    }

    async Connect(url) {

        console.log(url);
        /* Conecta a la Base de Mongo */
        await mongoose.connect(url, { useNewUrlParser: true }, (err, res) => {
            if (err) {
                this.status = 0;
                this.mensaje = err;
                this.error = true;
                return;
            }
            this.status = 1;
            this.mensaje = {};
            this.error = false;
        })
    };

    async Save(datos) {
        if (this.status === 0) {
            this.error = true;
            this.mensaje = JSON.stringify({
                mensaje: 'Sin Conexión a la BD'
            });
            return;
        }
        if (this.modelo === undefined) {
            this.error = true;
            this.mensaje = JSON.stringify({
                mensaje: 'Schema no definido, debe usar el método AddSchema'
            });
            return;
        }
        let sch = new this.modelo(datos);

        await sch.save((err, results) => {
            this.error = false;
            this.mensaje = {};
            if (err) {

                // Chequea que el error generado no sea por campo duplicado
                // y de ser un error real, devuelve el status y el mensaje

                if (!err.message.includes(this.uniqueMsg)) {
                    this.error = true;
                    this.mensaje = JSON.stringify(err);
                    return;
                }
            }

            this.error = false;
            this.mensaje = {};

        });
    }

    async FindOne() {
        await this.modelo.findOne((err, res) => {
            if (err) {
                this.error = true;
                this.mensaje = JSON.stringify(err);
                return;
            }
            if (!res === null) {
                this.resultado = res;
            } else {
                this.resultado = {};
            }
        })
    };

    async Update(instruccion) {
        await this.modelo.update(instruccion, (err, res) => {
            if (err) {
                this.error = true;
                this.mensaje = JSON.stringify(err);
                return;
            }
            this.error = false;
            this.mensaje = {};
        });
    };

}

module.exports = Mongo;