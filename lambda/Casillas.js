const preguntasVF = require('./exports/preguntasVF.json');
const fc = require('./exports/frasesCasillas.json')

class Casilla {
    constructor(id, url, frases) {
        this.id = id;
        this.url = url;
        this.frases = frases;
    }

    recibeJugador(jug, hayEquipos) {
        if (this.id === "META"){
            return ` Has caído en la casilla de meta. `
        }
        const desc = this.getFraseRandom(hayEquipos);

        return desc;
    }
    
    getFraseRandom(hayEquipos) {
        const desc = hayEquipos ? this.frases.equipo : this.frases.jugador;
        const idx = Math.floor(Math.random() * 3);

        return desc[idx];
    }
    
}

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

class CasillaVyF extends Casilla {
    constructor(id, url, frases, caracteristicaEspecial) {
        super(id, url, frases);
        this.caracteristicaEspecial = caracteristicaEspecial;
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
    Casilla,
    CasillaOca,
    CasillaPuente,
    CasillaPenalizacion,
    CasillaVyF
};