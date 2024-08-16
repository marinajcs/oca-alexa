const Casilla = require('./Casilla.js');
const preguntasCifras = require('../exports/preguntasCifras.json');

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
        desc += `Recordad que la respuesta debe ser un solo número, y si el ${hayEquipos ? 'equipo ' : 'participante ' } \
                 falla la pregunta, rebotará al siguiente. `;
                 
        return desc;
    }
}

module.exports = {
    CasillaCifras
};
