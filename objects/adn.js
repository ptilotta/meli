// ---------------------------------------------------------------
//  Objeto para manejo de ADN 
// ---------------------------------------------------------------
"use strict";
class Adn {

    /*
      @adn           = JSON con matriz
      @largoString   = Largo de caracteres a buscar en matriz (ej. 4)
      @ocurrencias   = cantidad de ocurrencias de patron necesarias para considerar un ADN en Mutante
      @letrasValidas = conjunto de letras válidas de la matriz
    */

    constructor(adn, largoString, ocurrencias, letrasValidas) {
        this.tabla = [];
        this.largoString = largoString;
        this.ocurrencias = ocurrencias;
        this.letrasValidas = letrasValidas;
        this.error = false;
        this.mensaje = {};
        this.mensajeError = {};
        this.camposMutantes = 0;
        this.adn = adn;
        this.x = 0;
        this.y = 0;
        this.iteroporFila = false;
        this.ultCaracter = "";
        this.iterar = true;
        this.tipo = "";
        this.desde = 0;
        this.desde2 = 0;
        this.incrementoColumna = 0;
        this.incrementoFila = 0;
        this.contador = 1;
    };

    creoTabla() {
        for (var i in this.adn) {
            this.tabla.push(this.adn[i]);
        }
    }

    validaciones() {
        if (!this._validoLongitudValida()) { return false; };
        if (!this._chequeoLetrasValidas()) { return false; };
        return true;
    }

    _validoLongitudValida() {
        let longitudElemento = 0;
        let longitud = 0;
        this.error = false;
        this.mensajeError = {};

        for (let i = 0; i < this.tabla.length; i++) {
            longitud = this.tabla[i].length;
            if (i === 0) {
                longitudElemento = longitud;
            } else {
                if (longitudElemento === longitud) {} else {
                    this.error = true
                    this.mensajeError = { "mensaje": "Los elementos de la Matriz 'dna' deben tener la misma longitud para poder formar una matriz" };
                    return false;
                }
            }
        }
        return true;
    }

    _chequeoLetrasValidas() {
        this.error = false;
        this.mensajeError = {};
        for (var i = 0; i < this.tabla.length; i++) {
            let registro = this.tabla[i];
            for (var ind = 1; ind <= registro.length; ind++) {
                let letra = registro.substr(ind, 1).toUpperCase();
                if (!this.letrasValidas.includes(letra, 0)) {
                    this.error = true
                    this.mensajeError = { "mensaje": `Los elementos de la Matriz 'dna' deben contener solo los juegos de valores de las letras ${this.letrasValidas}` };
                    return false;
                }
            }
        }
        return true;
    }

    isMutant() {
        let Matriz = [
            ["H", 0, 0, 0, 0],
            ["V", 0, 0, 0, 0],
            ["D", 0, 0, 1, 1],
            ["D", 0, 0, 1, 1]
        ];
        for (var i = 0; i < 4; i++) {
            this.tipo = Matriz[i][0];
            this.desde = Matriz[i][1];
            this.desde2 = Matriz[i][2];
            this.incrementoFila = Matriz[i][3];
            this.incrementoColumna = Matriz[i][4];
            this._recorroMatriz();
            if (this.camposMutantes >= this.ocurrencias) { return true; }
        }
        return false;
    }

    _asignoInicio() {
        if (this.tipo === "V") {
            this.y = this.desde2;
            this.x = this.desde;
            return;
        }
        this.y = this.desde;
        this.x = this.desde2;
    }

    _recorroMatriz() {
        var t = "";
        this._asignoInicio();

        while (true) {
            this.ultCaracter = "";
            this.iterar = true;
            if (!this._iterarMatriz()) { return; };
            if (!this._IncrementoParametros()) { return; };
        };
    };

    _iterarMatriz() {
        while (this.iterar) {
            t = this.tabla[y].substr(x, 1);
            this._comparoCaracter();
            if (this._metaAlcanzada()) {
                return false;
            }
            this.iterar = this._muevoCursor();
        }
    }

    _IncrementoParametros() {
        if (this.tipo === "V") {
            this.y = this.desde;
            if (!this._incrementoX()) { return false; }
        };
        if (this.tipo === "H") {
            this.x = this.desde2;
            if (!this._incrementoY()) { return false; }
        };
        if (this.tipo === "D") {
            if (!this._incrementoXY()) { return false; }
        }
        return true;
    }

    _incrementoY() {
        this.y += 1;
        if (this.y > (this.tabla.length - 1)) {
            return false;
        }
        return true;
    }

    _incrementoX() {
        this.x += 1;
        if (this.x > (this.tabla[0].length - 1)) {
            return false;
        }
        return true;
    }

    _incrementoDiag() {
        this.x += this.incrementoColumna;
        this.y += this.incrementoFila;
        if (this.x < 0 || this.y < 0 || this.x > (this.tabla[0].length - 1) || this.y > this.tabla.length) { return false; }
        return true;
    }

    _incrementoXY() {
        if (this.iteroporFila === false) {
            this._iteroPorColumna();
        } else {
            this._iteroPorFila();
        }
        if (this.y > this.tabla.length - 1) {
            return false;
        }
        return true;
    }

    _iteroPorColumna() {
        this.x = this.x + Math.abs(this.incrementoColumna);
        this.y = this.desde;
        if (this.x > (this.tabla[0].length - 1)) {
            this.iteroporFila = true;
        }
    }

    _iteroPorFila() {
        if (this.incrementoColumna < 0) {
            this.x = this.tabla[0].length - 1;
        } else {
            this.x = this.desde2;
        }
        this.y += Math.abs(this.incrementoFila);
    }

    _comparoCaracter() {
        if (this.ultCaracter === t) {
            this.contador += 1;
        } else {
            this.ultCaracter = t;
            this.contador = 1;
        }
    }

    _metaAlanzada() {
        if (this.contador === this.largoString) {
            this.camposMutantes += 1;
            if (this.camposMutantes >= this.ocurrencias) {
                return true;
            }
            contador = 0;
            ultCaracter = "";
        }
        return false;
    }
    _muevoCursor() {
        if (this.tipo === "V") {
            if (!this._incrementoY()) { return false; }
        };
        if (this.tipo === "H") {
            if (!this._incrementoX()) { return false; }
        };
        if (this.tipo === "D") {
            if (!this._incrementoDiag()) { return false; }
        }
        return true;
    }
};

module.exports = Adn;