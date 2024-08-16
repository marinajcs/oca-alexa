const Casilla = require('./Casilla.js');
const preguntasFechas = require('../exports/preguntasFechas.json')

class CasillaFechas extends Casilla {
    constructor(id, url, frases) {
        super(id, url, frases);
    }

    getPreguntaRandom() {
        const ind = Math.floor(Math.random() * preguntasFechas.length);
        return preguntasFechas[ind]
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
    CasillaFechas
};