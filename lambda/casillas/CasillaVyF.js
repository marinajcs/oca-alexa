const Casilla = require('./Casilla.js');
const preguntasVF = require('../exports/preguntasVF.json');

class CasillaVyF extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    getPreguntaRandom() {
        const ind = Math.floor(Math.random() * preguntasVF.length);
        return preguntasVF[ind]
    }
    
    recibeJugador(jug, hayEquipos) {
        if (hayEquipos){
            return 'Oh, ¡sorpresa! Habéis caído en el minijuego de Verdadero o Falso. ';
        }
        return 'Oh, ¡sorpresa! Has caído en el minijuego de Verdadero o Falso. ';
    }
}

module.exports = {
    CasillaVyF
};
