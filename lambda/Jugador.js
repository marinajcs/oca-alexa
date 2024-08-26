/**
 * Representa a un participante (equipo o individuo) en el juego.
 * @class
 */
class Jugador {
    /**
     * Crea una instancia de Jugador (participante que puede ser un equipo o individuo)
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
     * Devuelve la posición actual del participante en el tablero.
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
        this._posicion = npos;
    }
    
    /**
     * Establece el nombre del participante.
     * @param {string} nombre - El nuevo nombre del participante.
     */
    setNombre(nombre) {
        this.nombre = nombre;
    }
    
    /**
     * Devuelve el nombre del participante.
     * @returns {string} El nombre del participante.
     */
    getNombre() {
        return this.nombre;
    }
    
    /**
     * Establece el nombre del color del participante.
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
     * Devuelve el nombre del color asociado al participante.
     * @returns {string} El nombre del color del participante.
     */
    getColor() {
        return this.color;
    }
    
    /**
     * Devuelve el código hexadecimal del color asociado al participante.
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
    
    /**
     * Devuelve el identificador del participante.
     * @returns {number} El identificador del participante.
     */
    getId() {
        return this.id;
    }
    
    /**
     * Establece los puntos del participante.
     * @param {number} pts - Los nuevos puntos del participante.
     */
    setPuntos(pts) {
        this.puntos = pts;
    }
    
    /**
     * Añade puntos a los puntos actuales del participante.
     * @param {number} valor - Los puntos a añadir.
     */
    addPuntos(valor) {
        this._puntos += valor;
    }
    
    /**
     * Obtiene los puntos del participante.
     * @returns {number} Los puntos actuales del participante.
     */
    getPuntos() {
        return this.puntos;
    }
    
    /**
     * Establece la última casilla en la que estuvo el participante.
     * @param {number} ultimaCasilla - La última casilla en la que cayó el participante.
     */
    setUltimaCasilla(ultimaCasilla) {
        this.ultimaCasilla = ultimaCasilla;
    }
    
    /**
     * Devuelve la última casilla en la que estuvo el participante.
     * @returns {number} La última casilla en la que cayó el participante.
     */
    getUltimaCasilla() {
        return this.ultimaCasilla;
    }
}

module.exports = {
    Jugador
};
