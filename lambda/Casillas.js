class Casilla {
    constructor(id) {
        this.id = id;
    }

    getDescripcion() {
        return "Casilla normal";
    }
    
}

class CasillaOca extends Casilla {
    constructor(id) {
        super(id);
    }

    getDescripcion() {
        return "Casilla de oca en oca y tiro porque me toca";
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
    
    getDescripcion() {
        return "Casilla de minijuego";
    }
}

module.exports = {
    Casilla
};