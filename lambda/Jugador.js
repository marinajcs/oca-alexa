// gameLogic.js

function crearJugador(id, color, posicion, puntos) {
    return {
        id: id,
        color: color,
        posicion: posicion,
        puntos: puntos
    };
}

function crearJugadores(n) {
    const jugadores = [];
    const colores = ['Rojo', 'Azul', 'Verde', 'Amarillo'];

    for (let i = 0; i < n; i++) {
        const color = colores[i % colores.length];
        const jugador = crearJugador(i + 1, color, 0, 0);
        jugadores.push(jugador);
    }

    return jugadores;
}

module.exports = {
    crearJugadores
};
