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
    };

    /* 
      @nombre = Nombre del Schema
      @schema = definición del Schema
      @uniqueMsg = Mensaje para el error de Unique Validator
    */
    AddSchema(nombre, Schema, uniqueMsg) {
        return new promisse((resolve, reject) => {

            /* Crea un Schema para este objeto */

            this.uniqueMs = uniqueMsg;
            let sch = mongoose.Schema;
            let esquema = new sch(Schema);
            esquema.plugin(uniqueValidator, { message: uniqueMsg });
            try {
                console.log(`nombre = ${nombre} esquema=${esquema}`);
                this.modelo = mongoose.model(nombre, esquema);
                resolve(true);
            } catch (error) {
                reject(error);
            }
        });
    };



    Connect() {
        return new promisse((resolve, reject) => {

            /* Conecta a la Base de Mongo */

            let conectar = mongoose.connect(this.url, { useNewUrlParser: true });
            conectar.then(() => {
                this.status = 1;
                this.mensaje = {};
                this.error = false;
                resolve(this.mensaje);
            }, (err) => {
                this.status = 0;
                this.mensaje = err;
                this.error = true;
                reject(err);
            });
        });
    };

    Save(datos) {
        return new promisse((resolve, reject) => {
            console.log('=====================================');
            console.log('           SAVE                      ');
            console.log('=====================================');

            if (this.modelo === undefined) {
                this.error = true;
                this.mensaje = JSON.stringify({
                    mensaje: 'Schema no definido, debe usar el método AddSchema'
                });
                reject(this.mensaje);
            }

            let sch = new this.modelo(datos);
            let grabo = sch.save();

            grabo.then(() => {
                this.error = false;
                this.mensaje = {};
                resolve(this.mensaje);
            }, (err) => {

                // Chequea que el error generado no sea por campo duplicado
                // y de ser un error real, devuelve el status y el mensaje

                if (!err.message.includes(this.uniqueMsg)) {
                    this.error = true;
                    this.mensaje = JSON.stringify(err);
                    console.log(`ERROR EN SAVE : ${this.mensaje}`);
                    reject(this.mensaje);
                };
            });
        });
    };


    FindOne() {
        return new promisse((resolve, reject) => {

            console.log('=====================================');
            console.log('           FINDONE                   ');
            console.log('=====================================');

            let registro = this.modelo.findOne();
            registro.then(() => {
                console.log(` EL RESULTADO DE FINDONE ES ${registro}`);
                if (registro) {
                    this.resultado = registro;
                } else {
                    this.resultado = {};
                }
                resolve(this.resultado);
            }, (err) => {
                this.error = true;
                this.mensaje = JSON.stringify(error);
                console.log('Hubo Error en FINDONE', error);
                reject(err);
            });
        });
    };

    Update(instruccion) {
        return new promisse((resolve, reject) => {
            console.log('=====================================');
            console.log('           UPDATE                    ');
            console.log('=====================================');
            let actualizar = this.modelo.update();
            actualizar.then(() => {
                this.error = false;
                this.mensaje = {};
                resolve(this.mensaje);
            }, (err) => {
                this.error = true;
                this.mensaje = JSON.stringify(err);
                console.log(`Error en Update ${this.mensaje} para la instrucción ${instruccion}`);
                reject(err);
            });
        });
    };
};

module.exports = Mongo;