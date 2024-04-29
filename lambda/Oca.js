const {Tablero} = require('./Tablero.js')

function avanzaJugador(jActual, tirada, tablero, jugadores){
    let posActual = jActual.getPosActual();
    let posNueva = tablero.nuevaPosicion(posActual, tirada);
    let casillaNueva = tablero.getCasilla(posNueva);
    jActual.setPosActual(posNueva);
    let informe = '';
    let finPartida = false;
    informe = casillaNueva.recibeJugador(jActual);
    if (posNueva === (tablero.length-1)){
        informe = `¡Felicidades jugador ${jActual.color}, ha ganado la partida!`;
        finPartida = true;
    }
    return [casillaNueva, informe, finPartida];
}
    
function pasarTurno(jActual, jugadores, njugadores){
    let sig = jActual + 1;
    if (sig >= njugadores)
        jActual = 0;
    else
        jActual = sig;
        
    return jActual;
}

function getJugadoresCasilla(numCasilla, jActual, jugadores) {
    const jugadoresEnCasilla = jugadores.filter(jugador => jugador.posicion === numCasilla && jugador !== jActual);

    return jugadoresEnCasilla;
}

function tirarDado() {
    return Math.floor(Math.random() * 6) + 1;
}


module.exports = {
    tirarDado,
    getJugadoresCasilla,
    avanzaJugador,
    pasarTurno
};