class Jugador {
    constructor(id, color, codigo, posicion, puntos){
        this.id = id;
        this.color = color;
        this.codigo = codigo;
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
    const codigos = ['#FF0000', '#0000FF', '#008000', '#FFFF00'];

    for (let i = 0; i < n; i++) {
        const color = colores[i];
        const cod = codigos[i];
        let jugador = new Jugador(i + 1, color, cod, 0, 0);
        jugadores.push(jugador);
    }

    return jugadores;
}

module.exports = {
    crearJugadores
};
