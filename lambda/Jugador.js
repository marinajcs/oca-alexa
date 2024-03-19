// gameLogic.js

class Jugador {
    constructor(id, color, posicion, puntos){
        this.id = id;
        this.color = color;
        this.posicion = posicion;
        this.puntos = puntos;
    }
    
    getPosActual(){
        return this.posicion;
    }
    setPosActual(npos){
        this.posicion = npos;
    }
}


function crearJugadores(n) {
    let jugadores = [];
    const colores = ['Rojo', 'Azul', 'Verde', 'Amarillo'];

    for (let i = 0; i < n; i++) {
        const color = colores[i % colores.length];
        let jugador = new Jugador(i + 1, color, 0, 0);
        jugadores.push(jugador);
    }

    return jugadores;
}

module.exports = {
    crearJugadores
};
