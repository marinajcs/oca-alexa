const Casilla = require('./Casilla.js');

class CasillaPuente extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    recibeJugador(jug, hayEquipos) {
        if (hayEquipos){
            return 'Habéis caído en la casilla de puente. De puente a puente y me lleva la corriente.';
        }
        return `Has caído en la casilla de puente. De puente a puente y me lleva la corriente.`;
    }
}

module.exports = {
    CasillaPuente
};
