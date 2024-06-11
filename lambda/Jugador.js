class Jugador {
    constructor(id, color, codigo, posicion, puntos, nombre){
        this.id = id;
        this.color = color;
        this.codigo = codigo;
        this.posicion = posicion;
        this.puntos = puntos;
        this.nombre = nombre;
    }
    
    getPosActual() {
        return this.posicion;
    }
    
    setPosActual(npos) {
        this.posicion = npos;
    }
    
    setNombre(nombre) {
        this.nombre = nombre;
    }
    
    getNombre() {
        return this.nombre;
    }
}

function crearJugadores(n) {
    let jugadores = [];
    const colores = ['Rojo', 'Azul', 'Verde', 'Morado', 'Naranja', 'Gris'];
    const codigos = ['#FF0000', '#0000FF', '#008000', '#AA00FD', '#FD7D00', '#8C8C8C'];

    for (let i = 0; i < n; i++) {
        const color = colores[i];
        const cod = codigos[i];
        let jugador = new Jugador(i, color, cod, 0, 0, '');
        jugadores.push(jugador);
    }

    return jugadores;
}

module.exports = {
    crearJugadores,
    Jugador
};
