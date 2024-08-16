class Casilla {
    constructor(id, url, frases) {
        this.id = id;
        this.url = url;
        this.frases = frases;
    }
    
    getId() {
        return this.id;
    }

    recibeJugador(jug, hayEquipos) {
        if (this.id === "META"){
            return ` Has caído en la casilla de meta. `
        }
        const desc = this.getFraseRandom(hayEquipos);

        return desc;
    }
    
    getFraseRandom(hayEquipos) {
        const desc = hayEquipos ? this.frases.equipo : this.frases.jugador;
        const idx = Math.floor(Math.random() * 3);

        return desc[idx];
    }
}

module.exports = {
    Casilla
};
