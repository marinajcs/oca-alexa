const Casilla = require('./Casilla.js');

class CasillaPenalizacion extends Casilla {
    constructor(id, url, frases, penaliza) {
        super(id, url, frases);
        this.penaliza = penaliza;
    }

    recibeJugador(jug, hayEquipos) {
        if (hayEquipos){
            return `Mala suerte, habéis caído en ${this.id}. Perdéis ${this.penaliza} turnos.`;
        }
        return `Mala suerte, ha caído en ${this.id}. Pierdes ${this.penaliza} turnos.`;
    }
}

module.exports = {
    CasillaPenalizacion
};
