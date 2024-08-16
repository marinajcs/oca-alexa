const Casilla = require('./Casilla.js');

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

module.exports = {
    CasillaUltima
};
