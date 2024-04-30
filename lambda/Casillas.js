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
    constructor(id, url) {
        super(id, url);
    }

    recibeJugador(jug) {
        return "Casilla de oca en oca y tiro porque me toca";
    }
}

class CasillaPuente extends Casilla {
    constructor(id, url) {
        super(id, url);
    }

    recibeJugador(jug) {
        return "Casilla de puente a puente y me lleva la corriente";
    }
}

class CasillaPenalizacion extends Casilla {
    constructor(id, url) {
        super(id, url);
    }

    recibeJugador(jug) {
        return "Mala suerte, has caído en un pozo. Pierdes el siguiente turno.";
    }
}

class CasillaMinijuego extends Casilla {
    constructor(id, url, caracteristicaEspecial) {
        super(id, url);
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
    CasillaPuente,
    CasillaPenalizacion
};