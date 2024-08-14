const {Casilla, CasillaOca, CasillaPuente, CasillaPenalizacion, CasillaVyF, CasillaFechas} = require('./Casillas.js')
const fc = require('./exports/frasesCasillas.json')

class Tablero {
    constructor() {
        this.tablero = [];
        this.addCasilla(new Casilla("Salida", "https://i.ibb.co/Yfmk5mt/oca.png"));
    }

    addCasilla(casilla) {
        this.tablero.push(casilla);
    }

    getCasilla(numCasilla) {
        if (this.correcto(numCasilla)) {
            return this.tablero[numCasilla];
        } else {
            return null;
        }
    }

    getCasillas() {
        return this.tablero;
    }

    nuevaPosicion(actual, tirada) {
        let nueva_pos = actual + tirada;
        if (nueva_pos >= this.tablero.length) {
            let restantes = this.tablero.length - actual;
            let retrocede = tirada - restantes;
            nueva_pos = (this.tablero.length - 1) - retrocede ;
        }
        return nueva_pos;
    }

    correcto(numCasilla) {
        return numCasilla >= 0 && numCasilla < this.tablero.length;
    }
    
    buscarSiguienteOca(posActual) {
        for (let i = posActual + 1; i < this.tablero.length; i++) {
            if (this.tablero[i] instanceof CasillaOca) {
                return i;
            } else if (i === (this.tablero.length-1)) {
                return (this.tablero.length-1);
            }
        }
        return null;
    }
    
    buscarSiguientePuente(posActual) {
        for (let i = 0; i < this.tablero.length; i++) {
            if (this.tablero[i] instanceof CasillaPuente && i !== posActual) {
                return i;
            }
        }
        return null;
    }
    
}
/*
function crearTableroPrueba() { //unas 44 normales+minijuegos aprox (20-22 cada una)
    
    let tablero = new Tablero()
    
    //Salida[0] añadida en constructor de Tablero
    //...[1-3] (3)
    tablero.addCasilla(new Casilla("Casilla 1", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    tablero.addCasilla(new Casilla("Casilla 2", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    tablero.addCasilla(new Casilla("Casilla 3", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    //Oca[4]
    tablero.addCasilla(new CasillaOca("Oca 4", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg"));
    //Puente[5]
    tablero.addCasilla(new CasillaPuente("Puente 5", "https://i.ibb.co/QNCNpvZ/casilla-puente.jpg"));
    //...[6-7]
    tablero.addCasilla(new Casilla("Casilla 6", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    tablero.addCasilla(new Casilla("Casilla 7", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    //Oca[8]
    tablero.addCasilla(new CasillaOca("Oca 8", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg"));
    //...[9-10]
    tablero.addCasilla(new CasillaPenalizacion("Casilla 9", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", 2));
    tablero.addCasilla(new Casilla("Casilla 10", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    // Puente[11]
    tablero.addCasilla(new CasillaPuente("Puente 11", "https://i.ibb.co/QNCNpvZ/casilla-puente.jpg"));
    //Oca[12]
    tablero.addCasilla(new CasillaOca("Oca 12", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg"));
    //...[13-14]
    tablero.addCasilla(new Casilla("Casilla 13", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    tablero.addCasilla(new Casilla("Casilla 14", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    // Meta[15]
    tablero.addCasilla(new Casilla("META", "https://i.ibb.co/MpFDM44/casilla-meta.jpg"));
    
    return tablero;
    
}
*/
module.exports = {
    Tablero
};

