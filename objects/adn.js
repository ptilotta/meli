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

        // Creo la matriz desde el JSON recibido
        for (var i in adn) {
            this.tabla.push(adn[i]);
        }
    }

    validaciones() {
        if (!this.validoLongitudValida()) {
            return false;
        };
        if (!this.chequeoLetrasValidas()) {
            return false;
        };
        return true;
    }

    validoLongitudValida() {
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

    chequeoLetrasValidas() {
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

        this.recorroMatriz("H", 0, 0, 0, 0); // Recorrido Horizontal
        if (this.camposMutantes >= this.ocurrencias) { return true; }

        this.recorroMatriz("V", 0, 0, 0, 0); // Recorrido Vertical
        if (this.camposMutantes >= this.ocurrencias) { return true; }

        this.recorroMatriz("D", 0, 0, 1, 1); // Recorrido Diagonal - Derecha a Izquierda
        if (this.camposMutantes >= this.ocurrencias) { return true; }

        this.recorroMatriz("D", 0, 0, 1, -1); // Recorrido Diagonal - Izquierda a Derecha 
        if (this.camposMutantes >= this.ocurrencias) { return true; }

        return false;
    }

    recorroMatriz(tipo, desde, desde2, incrementoFila, incrementoColumna) {
        var contador = 1,
            x, y, actual_y, actual_x, iteroporFila = false,
            ultCaracter = '',
            t, iterar = true;

        if (tipo === "V") {
            y = desde2
            x = desde
            actual_y = desde2
            actual_x = desde
        } else {
            y = desde
            x = desde2
            actual_y = desde
            actual_x = desde2
        }

        while (true) {
            ultCaracter = "";
            iterar = true;
            while (iterar) {
                t = this.tabla[y].substr(x, 1);
                if (ultCaracter === t) {
                    contador += 1;
                } else {
                    ultCaracter = t;
                    contador = 1;
                }
                if (contador === this.largoString) {
                    this.camposMutantes += 1;
                    if (this.camposMutantes >= this.ocurrencias) {
                        return;
                    }
                    contador = 0;
                    ultCaracter = "";
                }
                switch (tipo) {
                    case "H":
                        x += 1;
                        if (x > (this.tabla[y].length - 1)) {
                            iterar = false;
                        }
                        break;
                    case "V":
                        y += 1;
                        if (y > (this.tabla.length - 1)) {
                            iterar = false;
                        }
                        break;
                    case "D":
                        x += incrementoColumna;
                        y += incrementoFila;
                        if (y > this.tabla.length - 1) {
                            iterar = false;
                            break;
                        }
                        if (x < 0 || y < 0 || x > (this.tabla[y].length - 1) || y > this.tabla.length) {
                            iterar = false;
                        }
                        break;
                }
            }
            switch (tipo) {
                case "V":
                    actual_y = desde;
                    actual_x += 1;
                    if (actual_x > (this.tabla[0].length - 1)) {
                        return;
                    }
                    break;
                case "H":
                    actual_y += 1;
                    actual_x = desde2;
                    if (actual_y > (this.tabla.length - 1)) {
                        return;
                    }
                    break;
                case "D":
                    if (iteroporFila === false) {
                        actual_x = actual_x + Math.abs(incrementoColumna)
                        actual_y = desde
                        if (actual_x > (this.tabla[0].length - 1)) {
                            iteroporFila = true;
                        }
                    }
                    if (iteroporFila = true) {
                        if (incrementoColumna < 0) {
                            actual_x = this.tabla[0].length - 1;
                        } else {
                            actual_x = desde2;
                        }
                        actual_y += Math.abs(incrementoFila);
                    }

                    if (actual_y > this.tabla.length - 1) {
                        return;
                    }
                    break;
            }
            y = actual_y;
            x = actual_x;
        };
    };
};

module.exports = Adn;