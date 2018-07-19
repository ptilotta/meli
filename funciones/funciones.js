// -------------------------------------------------
//  Funciones de la aplicación
// -------------------------------------------------

function chequeoLongitud(tabla) {
    let longitudElemento = 0;
    let longitud = 0;
    for (let i = 0; i < tabla.length; i++) {
        tabla[i] = reemplazoCaracteres(tabla[i]);
        longitud = tabla[i].length;
        if (i === 0) {
            longitudElemento = longitud;
        } else {
            if (longitudElemento === longitud) {} else {
                console.log('dio diferente');
                return false;
            }
        }
    }
    return true;
}

function chequeoLetrasValidas(tabla) {
    patron = "AGCT";
    let caracteres = "\"{}";

    for (var i = 0; i < tabla.length; i++) {
        tabla[i] = tabla[i].replace(new RegExp(caracteres, 'g'), '');
        let registro = tabla[i];
        for (var ind = 1; ind <= registro.length; ind++) {
            letra = registro.substr(ind, 1).toUpperCase();
            if (!patron.includes(letra, 0)) {
                return false;
            }
        }
    }
    return true;
}

function isMutant(dna) {

    let t, esM = false;
    let f, c;
    let camposMutantes = 0;

    // Chequeo Horizontal

    console.log('Chequeo Horizontal');
    console.log('==================');
    for (let i = 0; i < dna.length; i++) {
        t = dna[i];
        console.log(t);
        if (checkMutante(t)) { camposMutantes++ };
    }
    console.log(`Campos Mutantes : ${camposMutantes}\n`);
    if (camposMutantes > 1) { return true };

    // Chequeo Vertical

    console.log('Chequeo Vertical');
    console.log('================');
    for (let i = 0; i <= dna[0].length; i++) {
        t = "";
        for (let c = 0; c <= dna.length - 1; c++) {
            t += dna[c].substr(i, 1);
        }
        console.log(t);
        if (checkMutante(t)) { camposMutantes++ };
    }

    console.log(`Campos Mutantes : ${camposMutantes}\n`);
    if (camposMutantes > 1) { return true };

    //  si la matriz no supera las 4 filas, no tendrá nunca 4 casilleros en diagonal

    if (dna.length > 3) {

        // ============================= Recorrido Izquierda a Derecha =============================
        // no recorre todas las filas sino aquellas que tienen por lo menos 4 casilleros en diagonal

        console.log('Chequeo Diagonal x Filas I>D');
        console.log('============================');
        for (let fila = 0; fila <= (dna.length - 4); fila++) {
            t = "";
            f = fila;

            for (let c = 0; c <= dna.length; c++) {
                t += dna[f].substr(c, 1);
                f++;
                if (f > dna.length - 1) {
                    break;
                }
            }
            console.log(t);
            if (checkMutante(t)) { camposMutantes++ };
        }

        console.log(`Campos Mutantes : ${camposMutantes}\n`);
        if (camposMutantes > 1) { return true };



        // no recorre todas las columnas de la fila 0 sino aquellas que tienen por lo menos 4 casilleros en diagonal

        console.log('Chequeo Diagonal x Columnas I>D');
        console.log('===============================');
        for (let colu = 1; colu <= (dna[0].length - 4); colu++) {
            t = "";
            c = colu;

            for (let f = 0; f <= (dna[0].length - colu); f++) {
                t += dna[f].substr(c, 1);
                c++;
                if (c > dna[0].length - 1) {
                    break;
                }
            }
            console.log(t);
            if (checkMutante(t)) { camposMutantes++ };
        }

        console.log(`Campos Mutantes : ${camposMutantes}\n`);
        if (camposMutantes > 1) { return true };


        // ================================ Recorrido Derecha a Izquierda =============================
        //  no recorre todas las filas sino aquellas que tienen por lo menos 4 casilleros en diagonal

        console.log('Chequeo Diagonal x Filas D>I');
        console.log('============================');
        for (let fila = 0; fila < (dna.length - 3); fila++) {
            t = "";
            f = fila;
            for (let c = dna.length - 1; c > -1; c--) {
                t += dna[f].substr(c, 1);
                f++;
                if (f > dna.length - 1) {
                    break;
                }
            }
            console.log(t);
            if (checkMutante(t)) { camposMutantes++ };
        }

        console.log(`Campos Mutantes : ${camposMutantes}\n`);
        if (camposMutantes > 1) { return true };

        // no recorre todas las columnas de la fila 0 sino aquellas que tienen por lo menos 4 casilleros en diagonal

        console.log('Chequeo Diagonal x Columnas D>I');
        console.log('===============================');
        for (let colu = dna[0].length - 2; colu > 2; colu--) {
            t = "";
            c = colu;
            for (let f = 0; f <= dna.length; f++) {
                t += dna[f].substr(c, 1);
                c--;
                if (c < 0) {
                    break;
                }
            }
            console.log(t);
            if (checkMutante(t)) { camposMutantes++ };

        }

        console.log(`Campos Mutantes : ${camposMutantes}\n`);
        if (camposMutantes > 1) { return true };
    }

    if (camposMutantes > 1) { return true };

    return false;
}

function checkMutante(t) {
    if (t.includes("AAAA") || t.includes("CCCC") || t.includes("GGGG") || t.includes("GGGG")) {
        return true;
    } else {
        return false;
    }
}

function reemplazoCaracteres(t) {
    t = t.replace(/\{/g, '');
    t = t.replace(/\}/g, '');
    t = t.replace(/\"/g, '');
    return t
    console.log(t);
}

module.exports = {
    chequeoLongitud,
    isMutant,
    chequeoLetrasValidas,
    checkMutante
}