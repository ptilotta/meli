// ---------------------------------------------------------------
//  Objeto para manejo de Base de Datos MongoDB
// ---------------------------------------------------------------
"use strict";

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

class Mongo {
    constructor(url) {
        this.modelo; // Se creará el Modelo de Schema
        this.status = 0; // 0 = Desconectado, 1 = Conectado
        this.mensaje = {}; // Mensaje de Error en caso de que haya uno
        this.uniqueMsg; // Mensaje para el UniqueValidator
        this.error = false; // Indica cuando hubo un error
        this.resultado = {}; // Almacena el objeto JSON resultado de los Find   
        this.url = url; // URI de la conexión
        this.continue = true; // Indica si continua actualizando otras tablas luego de un error en esta Clase
    };

    /* 
      @nombre = Nombre del Schema
      @schema = definición del Schema
      @uniqueMsg = Mensaje para el error de Unique Validator
    */
    AddSchema(nombre, Schema, uniqueMsg) {

        /* Crea un Schema para este objeto */

        this.uniqueMsg = uniqueMsg;
        let mch = mongoose.Schema;

        // Intento borrar el Schema si es que fue definido anteriormente
        try {
            delete mongoose.connection.models[nombre];
        } catch (error) {}

        try {
            var esquema = new mch(Schema);
            esquema.plugin(uniqueValidator, { message: uniqueMsg });
            this.modelo = mongoose.model(nombre, esquema);
            this.mensaje = {};
            this.error = false;
        } catch (error) {
            this.mensaje = error;
            this.error = true;
        }
    };



    async Connect() {

        /* Conecta a la Base de Mongo */

        try {
            await mongoose.connect(this.url, { useNewUrlParser: true });
            this.status = 1;
            this.mensaje = {};
            this.error = false;

        } catch (error) {
            this.status = 0;
            this.mensaje = error;
            this.error = true;
        }
    };

    async Save(datos) {
        if (this.modelo === undefined) {
            this.error = true;
            this.mensaje = JSON.stringify({
                mensaje: 'Schema no definido, debe usar el método AddSchema'
            });
            return;
        }

        try {
            let sch = new this.modelo(datos);
            await sch.save();
            this.error = false;
            this.mensaje = {};
            return;
        } catch (error) {
            // Chequea que el error generado no sea por campo duplicado
            // y de ser un error real, devuelve el status y el mensaje
            if (!error.message.includes(this.uniqueMsg)) {
                this.error = true;
                this.mensaje = JSON.stringify(error);
            } else {
                /* Si el error fue registro duplicado (no se permite mas de 1 ADN) no continua
                                                       grabando las STATS */
                this.continue = false;
                this.error = false;
                this.mensaje = {};
            };
        };
    };


    async FindOne() {
        try {
            let registro = await this.modelo.findOne();
            console.log(`${registro}`);
            if (registro) {
                this.resultado = registro;
            } else {
                this.resultado = {};
            }
        } catch (error) {
            this.error = true;
            this.mensaje = JSON.stringify(error);
        }
    };

    async Update(instruccion) {
        try {
            await this.modelo.update(instruccion);
            this.error = false;
            this.mensaje = {};
        } catch (error) {
            this.error = true;
            this.mensaje = JSON.stringify(error);
        }
    };
};

module.exports = Mongo;