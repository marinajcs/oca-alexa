const Casilla = require('./Casilla.js');
const preguntasCompas = require('../exports/preguntasCompas.json');

class CasillaCompas extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    getPreguntaRandom() {
        const ind = Math.floor(Math.random() * preguntasCompas.length);
        return preguntasCompas[ind]
    }
    
    recibeJugador(jug, hayEquipos) {
        if (hayEquipos){
            return 'Oh, ¡sorpresa! Habéis caído en el minijuego de Conoce a tus compañeros. ';
        }
        return 'Oh, ¡sorpresa! Has caído en el minijuego de Conoce a tus compañeros. ';
    }
}

module.exports = {
    CasillaCompas
};