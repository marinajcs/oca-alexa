const {Casilla, CasillaOca, CasillaPuente} = require('./Casillas.js')
const fc = require('./exports/frasesCasillas.json')

/**
 * Representa el tablero de juego, gestionando las casillas y la lógica de movimiento.
 * @class
 */
class Tablero {
    /**
     * Crea un tablero del juego de la oca, inicializando con la casilla de salida 0.
     */
    constructor() {
        this.tablero = [];
        this.addCasilla(new Casilla("Salida", "https://i.ibb.co/Yfmk5mt/oca.png"));
    }

    /**
     * Añade una nueva casilla al tablero.
     * @param {Casilla} casilla - La casilla a añadir al tablero.
     */
    addCasilla(casilla) {
        this.tablero.push(casilla);
    }

    /**
     * Obtiene una casilla del tablero según el índice pasado.
     * @param {number} numCasilla - El índice de la casilla a obtener.
     * @returns {Casilla|null} La casilla en dicho índice o null si el índice es incorrecto.
     */
    getCasilla(numCasilla) {
        if (this.correcto(numCasilla)) {
            return this.tablero[numCasilla];
        } else {
            return null;
        }
    }

    /**
     * Calcula una nueva posición en el tablero a partir de la actual y una tirada de dado.
     * @param {number} actual - La posición actual en el tablero.
     * @param {number} tirada - El número obtenido en la tirada de dado.
     * @returns {number} La nueva posición en el tablero después de avanzar.
     */
    nuevaPosicion(actual, tirada) {
        let nueva_pos = actual + tirada;
        if (nueva_pos >= this.tablero.length) {
            let restantes = this.tablero.length - actual;
            let retrocede = tirada - restantes;
            nueva_pos = (this.tablero.length - 1) - retrocede ;
        }
        return nueva_pos;
    }

    /**
     * Comprueba si un índice de casilla es válido dentro del tablero.
     * @param {number} numCasilla - El índice de casilla a comprobar.
     * @returns {boolean} True si el número de casilla es válido, false en caso contrario.
     */
    correcto(numCasilla) {
        return numCasilla >= 0 && numCasilla < this.tablero.length;
    }
    
    /**
     * Busca la siguiente casilla de tipo 'Oca' tras la posición actual.
     * @param {number} posActual - La posición actual en el tablero.
     * @returns {number|null} El índice de la siguiente casilla de tipo 'Oca' o null si no la encuentra.
     */
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
    
    /**
     * Busca la otra casilla de tipo 'Puente' en el tablero, distinta a la actual.
     * @param {number} posActual - La posición actual en el tablero.
     * @returns {number|null} El índice de la otra casilla de tipo 'Puente' o null si no hay ninguna.
     */
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
