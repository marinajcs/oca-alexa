const {Tablero} = require('./Tablero.js')
const {CasillaOca, CasillaPuente, CasillaPenalizacion} = require('./Casillas.js')

function avanzaJugador(jActual, tirada, tablero, jugadores, penalizaciones){
    let finPartida = false;
    let dobleTurno = false;
    let posNueva = 0;
    let posActual = jActual.getPosActual();
    let casillaNueva;
    let informe = `Jugador ${jActual.color} está en la casilla ${posActual}. `;
    
    if (tablero.getCasilla(posActual) instanceof CasillaPenalizacion && penalizaciones[jActual.id] > 0){
        posNueva = posActual;
        casillaNueva = tablero.getCasilla(posNueva);
        informe = `Jugador ${jActual.color} no puede moverse aún. Turnos restantes antes de poder tirar el dado: ${penalizaciones[jActual.id]}. `
        penalizaciones[jActual.id] -= 1;
    } else {
        informe = `Jugador ${jActual.color} va a moverse ${tirada} casillas. `;
        posNueva = tablero.nuevaPosicion(posActual, tirada);
        casillaNueva = tablero.getCasilla(posNueva);
        jActual.setPosActual(posNueva);
        informe += casillaNueva.recibeJugador(jActual);
        
        if (casillaNueva instanceof CasillaOca){
            posNueva = tablero.buscarSiguienteOca(posNueva);
            casillaNueva = tablero.getCasilla(posNueva);
            jActual.setPosActual(posNueva);
            dobleTurno = true;
            informe += ` Ahora está en la casilla ${casillaNueva.id}. `
            
        } else if (casillaNueva instanceof CasillaPenalizacion){
            penalizaciones[jActual.id] += casillaNueva.penaliza;
            
        } else if (casillaNueva instanceof CasillaPuente){
            posNueva = tablero.buscarSiguientePuente(posNueva);
            casillaNueva = tablero.getCasilla(posNueva);
            jActual.setPosActual(posNueva);
            informe += ` Ahora está en la casilla ${casillaNueva.id}. `
        }
        
        if (casillaNueva.id === "META"){
            informe = ` ¡Felicidades jugador ${jActual.color}, ha ganado la partida! `;
            finPartida = true;
        }
    }
    return [casillaNueva, informe, finPartida, dobleTurno];
}
    
function pasarTurno(jActual, njugadores){
    let sig = jActual + 1;
    if (sig >= njugadores)
        sig = 0;
        
    return sig;
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