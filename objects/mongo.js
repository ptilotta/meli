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
    async AddSchema(nombre, Schema, uniqueMsg) {

        /* Crea un Schema para este objeto */
        this.uniqueMs = uniqueMsg;
        let sch = mongoose.Schema;
        let esquema = await new sch(Schema)
        esquema.plugin(uniqueValidator, { message: uniqueMsg });
        try {
            console.log(`nombre = ${nombre} esquema=${esquema}`);
            this.modelo = await mongoose.model(nombre, esquema);
        } catch (error) {}
    }

    async Connect() {

        /* Conecta a la Base de Mongo */
        await mongoose.connect(this.url, { useNewUrlParser: true }, (err, res) => {
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
        console.log('=====================================');
        console.log('           SAVE                      ');
        console.log('=====================================');
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
                    console.log(`ERROR EN SAVE : ${this.mensaje}`);
                    return;
                }
            }

            this.error = false;
            this.mensaje = {};

        });
    }

    async FindOne() {
        console.log('=====================================');
        console.log('           FINDONE                   ');
        console.log('=====================================');
        try {
            let registro = await this.modelo.findOne();
            console.log(` EL RESULTADO DE FINDONE ES ${registro}`);
            if (registro) {
                this.resultado = registro;
            } else {
                this.resultado = {};
            }
        } catch (error) {
            this.error = true;
            this.mensaje = JSON.stringify(error);
            console.log('Hubo Error en FINDONE', error);
            return;
        }
    };

    async Update(instruccion) {
        console.log('=====================================');
        console.log('           UPDATE                    ');
        console.log('=====================================');
        await this.modelo.update(instruccion, (err, res) => {
            if (err) {
                this.error = true;
                this.mensaje = JSON.stringify(err);
                console.log(`Error en Update ${this.mensaje} para la instrucción ${instruccion}`);
                return;
            }
            this.error = false;
            this.mensaje = {};
        });
    };

}

module.exports = Mongo;