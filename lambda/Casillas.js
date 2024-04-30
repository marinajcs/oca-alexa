class Casilla {
    constructor(id, url) {
        this.id = id;
        this.url = url;
    }

    recibeJugador(jug) {
        if (this.id === "META"){
            return ` Has caído en la casilla de meta. `
        }
        return `Has caído en la casilla normal: ${this.id}`;
    }
    
}

class CasillaOca extends Casilla {
    constructor(id, url) {
        super(id, url);
    }

    recibeJugador(jug) {
        return `Buena suerte, has caído en la casilla ${this.id}. De oca en oca y tiro porque me toca.`;
    }
}

class CasillaPuente extends Casilla {
    constructor(id, url) {
        super(id, url);
    }

    recibeJugador(jug) {
        return `Has caído en la casilla ${this.id}. De puente a puente y me lleva la corriente`;
    }
}

class CasillaPenalizacion extends Casilla {
    constructor(id, url, penaliza) {
        super(id, url);
        this.penaliza = penaliza;
    }

    recibeJugador(jug) {
        return `Mala suerte, has caído en un pozo. Pierdes ${this.penaliza} turnos.`;
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