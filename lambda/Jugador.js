class Jugador {
    constructor(id, color, codigo, posicion, puntos, nombre, ultimaCasilla){
        this.id = id;
        this.color = color;
        this.codigo = codigo;
        this.posicion = posicion;
        this.puntos = puntos;
        this.nombre = nombre;
        this.ultimaCasilla = ultimaCasilla;
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
    
    getColor() {
        return this.color;
    }
    
    getCodigo() {
        return this.color;
    }
    
    getId() {
        return this.id;
    }
    
    addPuntos(valor) {
        this.puntos += valor;
    }
    
    getPuntos() {
        return this.puntos;
    }
    
    setUltimaCasilla(ultimaCasilla) {
        this.ultimaCasilla = ultimaCasilla;
    }
    
    getUltimaCasilla() {
        return this.ultimaCasilla;
    }
}


module.exports = {
    Jugador
};
