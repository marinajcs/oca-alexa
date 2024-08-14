const preguntasVF = require('./exports/preguntasVF.json');
const preguntasFechaActual = require('./exports/preguntasFechaActual.json')
const preguntasFechas = require('./exports/preguntasFechas.json');

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

class CasillaFechas extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    getPreguntaRandom() {
        let ind, pregunta;
        //const tipo = Math.floor(Math.random() * 3);
        const tipo = 1;
        if (tipo !== 3) {
            ind = Math.floor(Math.random() * preguntasFechas.length);
            pregunta = preguntasFechas[ind]
        } else {
            ind = Math.floor(Math.random() * preguntasFechaActual.length);
            pregunta = preguntasFechaActual[ind];
        }
        return pregunta;
    }
    
    recibeJugador(jug, hayEquipos) {
        let desc;
        if (hayEquipos){
            desc = 'Oh, ¡sorpresa! Habéis caído en el minijuego de Adivina la fecha. ';
        } else {
            desc = 'Oh, ¡sorpresa! Has caído en el minijuego de Adiniva la fecha. ';
        }
        desc += 'Recordad que la respuesta debe ser un número solo. ';
        return desc;
    }
    
    getSeason(date) {
        const month = date.getMonth() + 1; // Enero es 0, ajustamos a 1-12
        if (month >= 3 && month <= 5) {
            return 'primavera';
        } else if (month >= 6 && month <= 8) {
            return 'verano';
        } else if (month >= 9 && month <= 11) {
            return 'otoño';
        } else {
            return 'invierno';
        }
    }
    
}

module.exports = {
    Casilla,
    CasillaOca,
    CasillaPuente,
    CasillaPenalizacion,
    CasillaVyF,
    CasillaFechas
};