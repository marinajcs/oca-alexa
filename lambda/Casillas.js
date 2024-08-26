const preguntasVF = require('./exports/preguntasVF.json');
const preguntasCifras = require('./exports/preguntasCifras.json');
const preguntasFechas = require('./exports/preguntasFechas.json');
const preguntasCompas = require('./exports/preguntasCompas.json');

/**
 * Representa una casilla general en el tablero de juego.
 * @class
 */
class Casilla {
    /**
     * Crea una nueva instancia de casilla.
     * @param {string} id - Identificador único de la casilla y su nombre.
     * @param {string} url - URL de la imagen asociada a la casilla.
     * @param {Object} frases - Frases asociadas a la casilla, diferenciadas por si el juego es en equipo o individual.
     */
    constructor(id, url, frases) {
        this.id = id;
        this.url = url;
        this.frases = frases;
    }
    
    /**
     * Obtiene el identificador o nombre de la casilla.
     * @returns {string} El identificador o nombre de la casilla.
     */
    getId() {
        return this.id;
    }

    /**
     * Recibe a un participante (equipo o jugador) en la casilla. 
     * @param {Jugador} jug - El jugador que ha caído en esta casilla.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Descripción del evento que ocurre cuando el participante cae en la casilla.
     */
    recibeJugador(jug, hayEquipos) {
        if (this.id === "META"){
            return `¡Buen trabajo! ${hayEquipos ? ' Habéis ' : 'Has ' } caído en la casilla de meta. `
        } else {
            return `${hayEquipos ? ' Habéis ' : 'Has ' } caído en la casilla ${this.id}. ` + this.getFraseRandom(hayEquipos);
        }
    }
    
    /**
     * Devuelve una frase aleatoria de la casilla, adaptada al tipo de participante.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Una frase aleatoria adecuada al contexto del juego.
     */
    getFraseRandom(hayEquipos) {
        const desc = hayEquipos ? this.frases.equipo : this.frases.jugador;
        const idx = Math.floor(Math.random() * 3);

        return desc[idx];
    }
    
}

/**
 * Representa una casilla de tipo "Oca" en el tablero de juego.
 * @class
 * @extends Casilla
 */
class CasillaOca extends Casilla {
    /**
     * Crea una casilla de tipo "Oca".
     * @param {string} id - Identificador único de la casilla.
     * @param {string} url - URL de la imagen asociada a la casilla.
     * @param {Object} frases - Frases asociadas a la casilla.
     */
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    /**
     * Recibe a un participante (equipo o jugador) en la casilla de oca. 
     * @param {Jugador} jug - El jugador que ha caído en esta casilla.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Descripción del evento que ocurre cuando el participante cae en la casilla de oca.
     */
    recibeJugador(jug, hayEquipos) {
        if (hayEquipos){
            return `Buena suerte, habéis caído en una casilla de oca. De oca en oca y tiro porque me toca.`
        }
        return `Buena suerte, has caído en una casilla de oca. De oca en oca y tiro porque me toca.`;
    }
}

class CasillaPuente extends Casilla {
    /**
     * Crea una casilla de tipo "Puente".
     * @param {string} id - Identificador único de la casilla.
     * @param {string} url - URL de la imagen asociada a la casilla.
     * @param {Object} frases - Frases asociadas a la casilla.
     */
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    /**
     * Recibe a un participante (equipo o jugador) en la casilla de puente. 
     * @param {Jugador} jug - El jugador que ha caído en esta casilla.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Descripción del evento que ocurre cuando el participante cae en la casilla de puente.
     */
    recibeJugador(jug, hayEquipos) {
        if (hayEquipos){
            return 'Habéis caído en la casilla de puente. De puente a puente y me lleva la corriente.';
        }
        return `Has caído en la casilla de puente. De puente a puente y me lleva la corriente.`;
    }
}

class CasillaPenalizacion extends Casilla {
    /**
     * Crea una casilla de tipo "Penalización".
     * @param {string} id - Identificador único de la casilla.
     * @param {string} url - URL de la imagen asociada a la casilla.
     * @param {Object} frases - Frases asociadas a la casilla.
     */
    constructor(id, url, frases, penaliza) {
        super(id, url, frases);
        this.penaliza = penaliza;
    }

    /**
     * Recibe a un participante (equipo o jugador) en la casilla de penalización. 
     * @param {Jugador} jug - El jugador que ha caído en esta casilla.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Descripción del evento que ocurre cuando el participante cae en la casilla de penalización.
     */
    recibeJugador(jug, hayEquipos) {
        if (hayEquipos){
            return `Mala suerte, habéis caído en la casilla ${this.id}. Perdéis ${this.penaliza} turnos.`;
        }
        return `Mala suerte, ha caído en ${this.id}. Pierdes ${this.penaliza} turnos.`;
    }
}

class CasillaVyF extends Casilla {
    /**
     * Crea una casilla del minijuego "verdadero o falso".
     * @param {string} id - Identificador único de la casilla.
     * @param {string} url - URL de la imagen asociada a la casilla.
     * @param {Object} frases - Frases asociadas a la casilla.
     */
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    /**
     * Devuelve una pregunta aleatoria de la batería de preguntas del minijuego "verdadero o falso".
     * @returns {string} Una pregunta aleatoria adecuada al tipo de minijuego.
     */
    getPreguntaRandom() {
        const ind = Math.floor(Math.random() * preguntasVF.length);
        return preguntasVF[ind]
    }
    
    /**
     * Recibe a un participante (equipo o jugador) en la casilla de minijuego verdadero o falso. 
     * @param {Jugador} jug - El jugador que ha caído en esta casilla.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Descripción del evento que ocurre cuando el participante cae en esta casilla de minijuego.
     */
    recibeJugador(jug, hayEquipos) {
        if (hayEquipos){
            return 'Oh, ¡sorpresa! Habéis caído en el minijuego de Verdadero o falso. ';
        }
        return 'Oh, ¡sorpresa! Has caído en el minijuego de Verdadero o falso. ';
    }
}

class CasillaCifras extends Casilla {
    /**
     * Crea una casilla del minijuego "adivina la cifra".
     * @param {string} id - Identificador único de la casilla.
     * @param {string} url - URL de la imagen asociada a la casilla.
     * @param {Object} frases - Frases asociadas a la casilla.
     */
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    /**
     * Devuelve una pregunta aleatoria de la batería de preguntas del minijuego "adivina la cifra".
     * @returns {string} Una pregunta aleatoria adecuada al tipo de minijuego.
     */
    getPreguntaRandom() {
        const ind = Math.floor(Math.random() * preguntasCifras.length);
        return preguntasCifras[ind];
    }
    
    /**
     * Recibe a un participante (equipo o jugador) en la casilla de minijuego adivina la cifra. 
     * @param {Jugador} jug - El jugador que ha caído en esta casilla.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Descripción del evento que ocurre cuando el participante cae en esta casilla de minijuego.
     */
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
    /**
     * Crea una casilla del minijuego "recuerda la fecha".
     * @param {string} id - Identificador único de la casilla.
     * @param {string} url - URL de la imagen asociada a la casilla.
     * @param {Object} frases - Frases asociadas a la casilla.
     */
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    /**
     * Devuelve una pregunta aleatoria de la batería de preguntas del minijuego "recuerda la fecha".
     * @returns {string} Una pregunta aleatoria adecuada al tipo de minijuego.
     */
    getPreguntaRandom() {
        const ind = Math.floor(Math.random() * preguntasFechas.length);
        return preguntasFechas[ind];
    }
    
    /**
     * Recibe a un participante (equipo o jugador) en la casilla de minijuego recuerda la fecha. 
     * @param {Jugador} jug - El jugador que ha caído en esta casilla.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Descripción del evento que ocurre cuando el participante cae en esta casilla de minijuego.
     */
    recibeJugador(jug, hayEquipos) {
        let desc;
        if (hayEquipos){
            desc = 'Oh, ¡sorpresa! Habéis caído en el minijuego de Recuerda la fecha. ';
        } else {
            desc = 'Oh, ¡sorpresa! Has caído en el minijuego de Recuerda la fecha. ';
        }
        return desc;
    }
    
    /**
     * Calcula y devuelve la solución a una pregunta basada en su tipo e identificador. 
     * @param {Object} pregunta - Objeto que contiene el tipo de pregunta y un identificador numérico.
     * @param {string} pregunta.type - El tipo de pregunta ('diaSemana', 'mes', 'estacion').
     * @param {number} pregunta.id - Identificador numérico para calcular la solución en función de la fecha actual.
     * @returns {string} La solución calculada o un mensaje de error si la pregunta no es válida.
     * @description Este método calcula la solución a la pregunta del minijuego recuerda la fecha. Por ejemplo,
     *              si la pregunta es "¿Qué día de la semana fue ayer?", su tipo es 'diaSemana' y su ID es -1,
     *              ya que ID 0 sería el día de la semana actual. El método devolvería el nombre del día de ayer.
     */
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
    
    /**
     * Calcula y devuelve el día de la semana basado en un desplazamiento desde el actual.
     * @param {Date} fecha - La fecha de referencia actual para el cálculo. Desde 0 (domingo) hasta 6 (sábado).
     * @param {number} id - Desplazamiento de días de la semana a partir del actual.
     * @returns {string} El nombre del día de la semana calculado.
     */
    getDiaSemana(fecha, id) {
        const diasSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
        const diaActual = fecha.getDay(); // 0 (domingo) - 6 (sábado)
        const diaCalculado = (diaActual + id + 7) % 7;
        return diasSemana[diaCalculado];
    }
    
    /**
     * Calcula y devuelve el mes del año basado en un desplazamiento desde el actual.
     * @param {Date} fecha - La fecha de referencia actual para el cálculo. Desde 0 (enero) hasta 11 (diciembre).
     * @param {number} id - Desplazamiento de meses del año a partir del actual.
     * @returns {string} El nombre del mes calculado.
     */
    getMes(fecha, id) {
        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const mesActual = fecha.getMonth(); // 0 (enero) - 11 (diciembre)
        const mesCalculado = (mesActual + id + 12) % 12;
        return meses[mesCalculado];
    }
    
    /**
     * Calcula y devuelve la estación del año basada en un desplazamiento desde la actual.
     * @param {Date} fecha - La fecha de referencia para el cálculo, utilizando el mes actual.
     * @param {number} id - Desplazamiento de meses del año a partir del actual.
     * @returns {string} El nombre del mes calculado.
     */
    getEstacion(fecha, id) {
        const estaciones = ['invierno', 'primavera', 'verano', 'otoño'];
        const mesActual = fecha.getMonth();
    
        let estacionActual;
        if (mesActual >= 2 && mesActual <= 4) {
            estacionActual = 1;
        } else if (mesActual >= 5 && mesActual <= 7) {
            estacionActual = 2;
        } else if (mesActual >= 8 && mesActual <= 10) {
            estacionActual = 3;
        } else {
            estacionActual = 0;
        }
    
        const estacionCalculada = (estacionActual + id + 4) % 4;
        return estaciones[estacionCalculada];
    }
   
}

class CasillaUltima extends Casilla {
    /**
     * Crea una casilla del minijuego "recuerda la última casilla".
     * @param {string} id - Identificador único de la casilla.
     * @param {string} url - URL de la imagen asociada a la casilla.
     * @param {Object} frases - Frases asociadas a la casilla.
     */
    constructor(id, url, frases) {
        super(id, url, frases);
    }
    
    /**
     * Recibe a un participante (equipo o jugador) en la casilla de minijuego recuerda la última casilla. 
     * @param {Jugador} jug - El jugador que ha caído en esta casilla.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Descripción del evento que ocurre cuando el participante cae en esta casilla de minijuego.
     */
    recibeJugador(jug, hayEquipos) {
        const informe = `Oh, ¡sorpresa! ${hayEquipos ? 'Habéis ' : 'Has '} caído en el minijuego de La última casilla. \
                         ¿Cuál fue la última casilla en la que ${hayEquipos ? 'estabais' : 'estabas'}? Dime el nombre de la casilla. `;
                         
        return informe;
    }
}

class CasillaCompas extends Casilla {
    /**
     * Crea una casilla del minijuego "conoce a tus compañeros".
     * @param {string} id - Identificador único de la casilla.
     * @param {string} url - URL de la imagen asociada a la casilla.
     * @param {Object} frases - Frases asociadas a la casilla.
     */
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    /**
     * Devuelve una pregunta aleatoria de la batería de preguntas del minijuego "conoce a tus compañeros", 
     * junto con el compañero sobre el que irá dicha pregunta.
     * @param {Array} compas - El conjunto de los compañeros de juego, salvo el participante encargado
     * de responder a la preguntar.
     * @returns {Array} Un array con la pregunta y compañero aleatorios.
     */
    getPreguntaRandom(compas) {
        const indP = Math.floor(Math.random() * preguntasCompas.length);
        const indC = Math.floor(Math.random() * compas.length);
        
        return [preguntasCompas[indP], compas[indC]];
    }
    
    /**
     * Recibe a un participante (equipo o jugador) en la casilla de minijuego conoce a tus compañeros. 
     * @param {Jugador} jug - El jugador que ha caído en esta casilla.
     * @param {boolean} hayEquipos - Indica si el juego se está jugando por equipos o no.
     * @returns {string} Descripción del evento que ocurre cuando el participante cae en esta casilla de minijuego.
     */
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