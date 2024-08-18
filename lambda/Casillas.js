const preguntasVF = require('./exports/preguntasVF.json');
const preguntasCifras = require('./exports/preguntasCifras.json');
const preguntasFechas = require('./exports/preguntasFechas.json');
const preguntasCompas = require('./exports/preguntasCompas.json');

class Casilla {
    constructor(id, url, frases) {
        this.id = id;
        this.url = url;
        this.frases = frases;
    }
    
    getId() {
        return this.id;
    }

    recibeJugador(jug, hayEquipos) {
        if (this.id === "META"){
            return `¡Buen trabajo! ${hayEquipos ? ' Habéis ' : 'Has ' } caído en la casilla de meta. `
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

class CasillaCifras extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    getPreguntaRandom() {
        const ind = Math.floor(Math.random() * preguntasCifras.length);
        return preguntasCifras[ind];
    }
    
    recibeJugador(jug, hayEquipos) {
        let desc;
        if (hayEquipos){
            desc = 'Oh, ¡sorpresa! Habéis caído en el minijuego de Adivina la Cifra. ';
        } else {
            desc = 'Oh, ¡sorpresa! Has caído en el minijuego de Adiniva la Cifra. ';
        }
        desc += 'Recordad que la respuesta debe ser solo un número, y si es incorrecta, la pregunta rebotará al siguiente. ';
        return desc;
    }
}

class CasillaFechas extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    getPreguntaRandom() {
        const ind = Math.floor(Math.random() * preguntasFechas.length);
        return preguntasFechas[ind];
    }
    
    recibeJugador(jug, hayEquipos) {
        let desc;
        if (hayEquipos){
            desc = 'Oh, ¡sorpresa! Habéis caído en el minijuego de Recuerda la fecha. ';
        } else {
            desc = 'Oh, ¡sorpresa! Has caído en el minijuego de Recuerda la fecha. ';
        }
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

class CasillaUltima extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }
    
    recibeJugador(jug, hayEquipos) {
        const informe = `Oh, ¡sorpresa! ${hayEquipos ? 'Habéis ' : 'Has '} caído en el minijuego de La Última Casilla. \
                         ¿Cuál fue la última casilla en la que ${hayEquipos ? 'estabais' : 'estabas'}? Dime el nombre de la casilla. `;
                         
        return informe;
    }
}

class CasillaCompas extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    getPreguntaRandom(compas) {
        const indP = Math.floor(Math.random() * preguntasCompas.length);
        const indC = Math.floor(Math.random() * compas.length);
        
        return [preguntasCompas[indP], compas[indC]];
    }
    
    recibeJugador(jug, hayEquipos) {
        const informe = `Oh, ¡sorpresa! ${hayEquipos ? 'Habéis ' : 'Has '} caído en el minijuego de Conoce a tus compañeros. \
                         ${hayEquipos ? ' Recordad ' : ' Recuerda '} que la respuesta debe ser 'sí' o 'no'. `;
        
        return informe;
    }
}

module.exports = {
    Casilla,
    CasillaOca,
    CasillaPuente,
    CasillaPenalizacion,
    CasillaVyF,
    CasillaCifras,
    CasillaFechas,
    CasillaCompas,
    CasillaUltima
};