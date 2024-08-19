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
            return 'Oh, ¡sorpresa! Habéis caído en el minijuego de Verdadero o falso. ';
        }
        return 'Oh, ¡sorpresa! Has caído en el minijuego de Verdadero o falso. ';
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
            desc = 'Oh, ¡sorpresa! Habéis caído en el minijuego de Adivina la cifra. ';
        } else {
            desc = 'Oh, ¡sorpresa! Has caído en el minijuego de Adiniva la cifra. ';
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
    
    getSolucion(pregunta) {
        const type = pregunta.type; 
        const id = pregunta.id;
        const hoy = new Date();
    
        switch (type) {
            case 'diaSemana':
                return this.getDiaSemana(hoy, id);
            case 'mes':
                return this.getMes(hoy, id);
            case 'estacion':
                return this.getEstacion(hoy, id);
            default:
                return 'Tipo de pregunta no reconocido.';
        }
    }
    
    getDiaSemana(fecha, id) {
        const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const diaActual = fecha.getDay(); // 0 (domingo) - 6 (sábado)
        const diaCalculado = (diaActual + id + 7) % 7;
        return diasSemana[diaCalculado];
    }
    
    getMes(fecha, id) {
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const mesActual = fecha.getMonth(); // 0 (enero) - 11 (diciembre)
        const mesCalculado = (mesActual + id + 12) % 12;
        return meses[mesCalculado];
    }
    
    getEstacion(fecha, id) {
        const estaciones = ['invierno', 'primavera', 'verano', 'otoño'];
        const mesActual = fecha.getMonth();
    
        let estacionActual;
        if (mesActual >= 2 && mesActual <= 4) {
            estacionActual = 1; // primavera
        } else if (mesActual >= 5 && mesActual <= 7) {
            estacionActual = 2; // verano
        } else if (mesActual >= 8 && mesActual <= 10) {
            estacionActual = 3; // otoño
        } else {
            estacionActual = 0; // invierno
        }
    
        const estacionCalculada = (estacionActual + id + 4) % 4;
        return estaciones[estacionCalculada];
    }
   
}

class CasillaUltima extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }
    
    recibeJugador(jug, hayEquipos) {
        const informe = `Oh, ¡sorpresa! ${hayEquipos ? 'Habéis ' : 'Has '} caído en el minijuego de La última casilla. \
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
                         Recordad que ambos podéis ganar puntos si acertáis. `;
        
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