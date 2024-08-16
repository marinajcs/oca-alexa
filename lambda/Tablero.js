/*
const {Casilla} = require('./casillas/Casilla.js');
const {CasillaOca} = require('./casillas/CasillaOca.js');
const {CasillaPuente} = require('./casillas/CasillaPuente.js');
*/
const {Casilla, CasillaOca, CasillaPuente} = require('./Casillas.js')
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

module.exports = {
    Tablero
};
