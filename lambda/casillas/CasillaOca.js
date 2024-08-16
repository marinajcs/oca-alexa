const Casilla = require('./Casilla.js');

class CasillaOca extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    recibeJugador(jug, hayEquipos) {
        if (hayEquipos){
            return `Buena suerte, habéis caído en una casilla de oca. De oca en oca y tiro porque me toca.`
        }
        return `Buena suerte, has caído en una casilla de oca. De oca en oca y tiro porque me toca.`;
    }
}

module.exports = {
    CasillaOca
};
