/**
 * Representa a un participante (equipo o individuo) en el juego.
 * @class
 */
class Jugador {
    /**
     * Crea una instancia de Jugador.
     * @param {number} id - Identificador único del participante.
     * @param {string} color - Nombre del color asignado al participante.
     * @param {string} codigo - Código hexadecimal del color asociado al participante.
     * @param {number} posicion - Posición actual del participante en el tablero.
     * @param {number} puntos - Puntos acumulados por el participante.
     * @param {string} nombre - Nombre del participante.
     * @param {number} ultimaCasilla - Última casilla en la que estuvo el participante.
     */
    constructor(id, color, codigo, posicion, puntos, nombre, ultimaCasilla){
        this.id = id;
        this.color = color;
        this.codigo = codigo;
        this.posicion = posicion;
        this.puntos = puntos;
        this.nombre = nombre;
        this.ultimaCasilla = ultimaCasilla;
    }
    
    /**
     * Obtiene la posición actual del participante en el tablero.
     * @returns {number} La posición actual del participante.
     */
    getPosActual() {
        return this.posicion;
    }
    
    /**
     * Establece una nueva posición para el participante en el tablero.
     * @param {number} npos - La nueva posición del participante.
     */
    setPosActual(npos) {
        this.posicion = npos;
    }
    
    /**
     * Establece el nombre del participante.
     * @param {string} nombre - El nuevo nombre del participante.
     */
    setNombre(nombre) {
        this.nombre = nombre;
    }
    
    /**
     * Obtiene el nombre del participante.
     * @returns {string} El nombre del participante.
     */
    getNombre() {
        return this.nombre;
    }
    
    /**
     * Establece el color del participante.
     * @param {string} color - El nuevo color del participante.
     */
    setColor(color) {
        this.color = color;
    }
    
    /**
     * Establece el código hexadecimal del color asociado al participante.
     * @param {string} codigo - El nuevo código hexadecimal del color del participante.
     */
    setCodigo(codigo) {
        this.codigo = codigo;
    }
    
    /**
     * Obtiene el nombre del color asociado al participante.
     * @returns {string} El nombre del color del participante.
     */
    getColor() {
        return this.color;
    }
    
    /**
     * Obtiene el código hexadecimal del color asociado al participante.
     * @returns {string} El código hexadecimal del color del participante.
     */
    getCodigo() {
        return this.codigo;
    }
    
    /**
     * Establece el identificador del participante.
     * @param {number} id - El nuevo identificador del participante.
     */
    setId(id) {
        this.id = id;
    }
    
    getId() {
        return this.id;
    }
    
    setPuntos(pts) {
        this.puntos = pts;
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
