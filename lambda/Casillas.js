class Casilla {
    constructor(id, url) {
        this.id = id;
        this.url = url;
    }

    recibeJugador(jug) {
        return `Has caído en la casilla normal ${this.id}`;
    }
    
}

class CasillaOca extends Casilla {
    constructor(id) {
        super(id);
    }

    recibeJugador(jug) {
        return "Casilla de oca en oca y tiro porque me toca";
    }
}

class CasillaPuente extends Casilla {
    constructor(id) {
        super(id);
    }

    recibeJugador(jug) {
        return "Casilla de puente a puente y me lleva la corriente";
    }
}

class CasillaMinijuego extends Casilla {
    constructor(id, caracteristicaEspecial) {
        super(id);
        this.caracteristicaEspecial = caracteristicaEspecial;
    }

    getCaracteristicaEspecial() {
        return this.caracteristicaEspecial;
    }
    
    recibeJugador(jug) {
        return "Casilla de minijuego";
    }
}

module.exports = {
    Casilla,
    CasillaOca,
    CasillaPuente
};