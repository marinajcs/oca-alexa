const {Tablero} = require('./Tablero.js')
const {CasillaOca, CasillaPuente, CasillaPenalizacion, CasillaVyF} = require('./Casillas.js')

function avanzaJugador(jActual, tirada, tablero, jugadores, penalizaciones, hayEquipos){
    let finPartida = false;
    let dobleTurno = false;
    let minijuego = 0;
    let posNueva = 0;
    let posActual = jActual.getPosActual();
    let casillaNueva;
    let informe = `${hayEquipos ? 'El equipo' : ''} ${jActual.nombre} estaba en la casilla ${posActual}. `;
    
    if (tablero.getCasilla(posActual) instanceof CasillaPenalizacion && penalizaciones[jActual.id] > 0){
        posNueva = posActual;
        casillaNueva = tablero.getCasilla(posNueva);
        informe += `${hayEquipos ? 'El equipo' : ''} ${jActual.nombre} no puede moverse aún. ${penalizaciones[jActual.id] === 1 ? 'Queda' : 'Quedan'} ${penalizaciones[jActual.id]} \
                    ${penalizaciones[jActual.id] === 1 ? 'turno' : 'turnos'} antes de poder volver a tirar el dado. `
        penalizaciones[jActual.id] -= 1;
    } else {
        posNueva += tablero.nuevaPosicion(posActual, tirada);
        casillaNueva = tablero.getCasilla(posNueva);
        jActual.setPosActual(posNueva);
        informe += `Tras moverse ${tirada} ${tirada === 1 ? 'casilla' : 'casillas'}, ahora está en la casilla ${posNueva}. `;
        informe += casillaNueva.recibeJugador(jActual, hayEquipos);
        
        if (casillaNueva instanceof CasillaOca){
            posNueva = tablero.buscarSiguienteOca(posNueva);
            casillaNueva = tablero.getCasilla(posNueva);
            jActual.setPosActual(posNueva);
            dobleTurno = true;

        } else if (casillaNueva instanceof CasillaPenalizacion){
            penalizaciones[jActual.id] += casillaNueva.penaliza;
            
        } else if (casillaNueva instanceof CasillaPuente){
            posNueva = tablero.buscarSiguientePuente(posNueva);
            casillaNueva = tablero.getCasilla(posNueva);
            jActual.setPosActual(posNueva);

        } else if (casillaNueva instanceof CasillaVyF) {
            minijuego = 1;
            
        }/* else if (casillaNueva instanceof CasillaCompas) {
            minijuego = 2;
        }
        */
        
        if (casillaNueva.id === "META"){
            informe += `${casillaNueva.id}. ¡Felicidades ${jActual.nombre}, ${hayEquipos ? 'habéis' : 'has'} ganado la partida! `;
            finPartida = true;
        }
    }
    return [casillaNueva, informe, finPartida, dobleTurno, minijuego];
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


module.exports = {
    getJugadoresCasilla,
    avanzaJugador,
    pasarTurno
};