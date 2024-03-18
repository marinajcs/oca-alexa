class Casilla {
    constructor(tipo) {
        this.tipo = tipo;
    }

    getTipo() {
        return this.tipo;
    }
}

// Definir una clase para una casilla especial
class CasillaEspecial extends Casilla {
    constructor(tipo, caracteristicaEspecial) {
        super(tipo);
        this.caracteristicaEspecial = caracteristicaEspecial;
    }

    // Método para obtener la característica especial de la casilla
    getCaracteristicaEspecial() {
        return this.caracteristicaEspecial;
    }
}


function crearTablero() {
    
    const tablero = {
        ncasillas: 50,
        casillas: []
    };
    
    
}

function tirarUnDado() {
    return Math.floor(Math.random() * 6) + 1;
}

module.exports = {
    crearTablero,
    tirarUnDado
};