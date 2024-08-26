const {EstadoJuego} = require('./EstadoJuego.js');
const {Tablero} = require('./Tablero.js');
const {Jugador} = require('./Jugador.js');
const {Casilla, CasillaOca, CasillaPuente, CasillaPenalizacion, CasillaCompas,
       CasillaVyF, CasillaCifras, CasillaUltima, CasillaFechas} = require('./Casillas.js');
const fc = require('./exports/frasesCasillas.json');

/**
 * Clase que representa un juego de la Oca.
 */
class JuegoOca {
    /**
     * Crea una nueva instancia del juego de la Oca.
     */
    constructor() {
        this.hayEquipos = false;
        this.jugadores = [];
        this.numJugadores = 0;
        this.turno = 0;
        this.penalizaciones = [];
        this.tablero = this.crearTableroPrueba();
        this.ronda = 1;
        this.estado = EstadoJuego.INDETERMINADO;
    }
    
    /**
     * Establece si el modo de juego es por equipos o no.
     * @param {boolean} hayEquipos - Indica si los participantes van en equipos.
     */
    setEquipos(hayEquipos) {
        this.hayEquipos = hayEquipos;
    }
    
    /**
     * Obtiene el tipo de participantes.
     * @returns {boolean} - Devuelve true si hay equipos, false en caso contrario.
     */
    getEquipos() {
        return this.hayEquipos;
    }
    
    /**
     * Establece la ronda actual.
     * @param {number} ronda - El número de ronda actual.
     */
    setRonda(ronda) {
        this.ronda = ronda;
    }
    
    /**
     * Obtiene la ronda actual.
     * @returns {number} - El número de la ronda actual.
     */
    getRonda() {
        return this.ronda;
    }
    
    /**
     * Obtiene el turno actual.
     * @returns {number} - El número del turno actual.
     */
    getTurno() {
       return this.turno;
    }
    
    /**
     * Establece el estado actual del juego.
     * @param {EstadoJuego} estado - El estado actual del juego.
     */
    setEstado(estado) {
        this.estado = estado;
    }
    
    /**
     * Obtiene el estado actual del juego.
     * @returns {EstadoJuego} - El estado actual del juego.
     */
    getEstado() {
        return this.estado;
    }
    
    /**
     * Obtiene un participante específico por su índice o identificador.
     * @param {number} i - El índice o identificador del participante.
     * @returns {Jugador|null} - El participante si existe, null en caso contrario.
     */
    getJugador(i) {
        if (i >= 0 && i < this.numJugadores)
            return this.jugadores[i];
        else
            return null;
    }
    
    /**
     * Obtiene el participante con el turno actual.
     * @returns {Jugador} - El participante con el turno actual.
     */
    getJugadorActual() {
        return this.jugadores[this.turno];
    }
    
    /**
     * Obtiene el nombre del participante con el turno actual.
     * @returns {string} - El nombre del participante con el turno actual.
     */
    getNombreJActual() {
        return this.jugadores[this.turno].getNombre();
    }
    
    /**
     * Obtiene el conjunto de participantes de la partida.
     * @returns {Jugador[]} - Un array con todos los participantes.
     */
    getJugadores() {
        return this.jugadores;
    }
    
    /**
     * Obtiene los participantes en una casilla específica.
     * @param {number} numCasilla - El número de la casilla.
     * @returns {Jugador[]} - Un array de los participantes en la casilla especificada.
     */
    getJugadorCasilla(numCasilla) {
        const jugEnCasilla = this.jugadores.filter(jugador => jugador.posicion === numCasilla);
    
        return jugEnCasilla;
    }
    
    /**
     * Obtiene los participantes en una casilla específica, salvo el del turno actual.
     * @param {number} numCasilla - El número de la casilla.
     * @param {Jugador} jActual - El participante actual.
     * @returns {Jugador[]} - Un array de participantes en la casilla especificada, salvo el actual.
     */
    getJugadoresCasilla(numCasilla, jActual) {
        const jugadoresEnCasilla = this.jugadores.filter(jugador => jugador.posicion === numCasilla && jugador !== jActual);
        
        return jugadoresEnCasilla;
    }
    
    /**
     * Obtiene el número total de participantes.
     * @returns {number} - El número total de participantes.
     */
    getNumJugadores() {
        return this.numJugadores;
    }
    
    /**
     * Obtiene los compañeros de un participante (el resto de implicados en la partida).
     * @param {Jugador} jActual - El participante actual.
     * @returns {Jugador[]} - Un array con los compañeros del participante actual.
     */
    getCompas(jActual) {
        const compas = this.jugadores.filter(jugador => jugador !== jActual);
        
        return compas;
    }
    
    /**
     * Obtiene los turnos penalizados de un participante específico.
     * @param {number} idJugador - El índice o ID del participante.
     * @returns {number} - El número de turnos de penalización del participante concreto.
     */
    getPenalizaciones(idJugador) {
        return this.penalizaciones[idJugador];
    }
    
    /**
     * Avanza el turno al siguiente participante, incrementando el número de ronda si es preciso.
     * @returns {string} - Un mensaje anunciando el turno del siguiente participante.
     */
    pasarTurno() {
        let sig = this.turno + 1;
        if (sig >= this.numJugadores) {
            sig = 0;
            this.ronda++;
        }
        this.turno = sig;
        this.setEstado(EstadoJuego.TIRAR_DADO);
        
        return this.anunciarTurno();
    }
    
    /**
     * Calcula el siguiente participante en caso de rebote, sin modificar el turno actual.
     * @param {number} jActual - El índice del participante actual.
     * @returns {number} - El índice del siguiente participante.
     */
    calcularRebote(jActual) {
        let sig = jActual + 1;
        if (sig >= this.numJugadores)
            sig = 0;
            
        return sig;
    }
    
    /**
     * Devuelve un mensaje anunciando el turno del siguiente participante. Considera las posibles penalizaciones.
     * @returns {string|null} - Un mensaje anunciando el siguiente turno o null si no es el turno de tirar el dado.
     */
    anunciarTurno() {
        if (this.estado === EstadoJuego.TIRAR_DADO) {
            let jActual = this.getJugadorActual();
            let informe = `<break time="3s"/> Ahora es el turno de ${jActual.getNombre()}. `;
            
            if (this.penalizaciones[jActual.getId()] > 0){
                informe += `Vaya... ${this.hayEquipos ? 'El equipo' : ''} ${jActual.getNombre()} no puede moverse aún porque sigue en la casilla \
                ${this.tablero.getCasilla(jActual.getPosActual()).getId()}. ${this.penalizaciones[jActual.getId()] === 1 ? ' Queda ' : ' Quedan '} \
                ${this.penalizaciones[jActual.getId()]} ${this.penalizaciones[jActual.getId()] === 1 ? ' turno ' : ' turnos '} antes de poder volver a tirar el dado. `
                this.penalizaciones[jActual.getId()] -= 1;
                informe += this.pasarTurno();
                
            } else if (this.getRonda() < 4) {
                informe += `Para poder tirar el dado, diga: 'Tirar dado'. `;
            } else {
                informe += `Por favor, ${this.hayEquipos ? 'tiren' : 'tire'} el dado. `;
            }
            return informe;
        } else {
            return null;
        }
    }
    
    /**
     * Devuelve un mensaje anunciando los ganadores de la partida, en caso de que haya finalizado.
     * @returns {string} - Un mensaje anunciando los ganadores o que la partida sigue en curso.
     */
    anunciarGanadores() {
        let resultados;

        if (this.estado === EstadoJuego.FINALIZADO) {
            const jugEnMeta = this.getJugadorActual();
            resultados = `Enhorabuena${this.hayEquipos ? ' al equipo' : ' al participante'} ${jugEnMeta.getNombre()}, que ha ganado la \
                          partida al llegar a la meta en primer lugar. `;
            
            const jugMayorPts = this.jugadores.reduce((max, actual) => 
                actual.getPuntos() > max.getPuntos() ? actual : max, this.jugadores[0]
            );
            
            if (jugMayorPts === jugEnMeta) {
                resultados += `Además,${this.hayEquipos ? ' habéis' : ' has'} acumulado más puntos que nadie, \
                                ${jugMayorPts.getPuntos()} puntos en total, por tanto también${this.hayEquipos ? ' conseguís' : ' consigues'}
                                la Medalla de Minijuegos. ¡Felicidades! `;
            } else {
                resultados += ` Honorable mención${this.hayEquipos ? ' al equipo' : ' al participante'} ${jugMayorPts.getNombre()}, \
                                que con ${jugMayorPts.getPuntos()} puntos ha logrado la mayor cantidad, por tanto se lleva la \
                                Medalla de Minijuegos. ¡Felicidades! `;
            }
            
        } else {
            resultados = 'La partida todavía sigue en curso, nadie ha llegado a la meta aún. ';
        }
        return resultados;
    }
    
    /**
     * Avanza al participante actual una cantidad de casillas concreta, actualizando su posición y manejando los eventos en 
     * función de la casilla en la que caerá.
     * @param {Jugador} jActual - El participante actual.
     * @param {number} tirada - El número de posiciones que debe moverse.
     * @returns {[Casilla, string]|null} - Un array con la nueva casilla y un informe del movimiento, o null si no es el momento de mover la ficha.
     */
    avanzaJugador(jActual, tirada){
        if (this.estado === EstadoJuego.MOVER_FICHA) {
            let finPartida = false;
            let dobleTurno = false;
            let minijuego = 0;
            let posNueva = 0;
            let posActual = jActual.getPosActual();
            let casillaNueva;
            let informe = `${this.hayEquipos ? 'El equipo' : ''} ${jActual.nombre} estaba en la casilla ${posActual}. `;
            jActual.setUltimaCasilla(this.tablero.getCasilla(posActual).getId());
            
            if (this.tablero.getCasilla(posActual) instanceof CasillaPenalizacion && this.penalizaciones[jActual.id] > 0){
                posNueva = posActual;
                casillaNueva = this.tablero.getCasilla(posNueva);
                informe += `${this.hayEquipos ? 'El equipo' : ''} ${jActual.nombre} no puede moverse aún. ${this.penalizaciones[jActual.id] === 1 ? 'Queda' : 'Quedan'} ${this.penalizaciones[jActual.id]} \
                            ${this.penalizaciones[jActual.id] === 1 ? 'turno' : 'turnos'} antes de poder volver a tirar el dado. `

            } else {
                posNueva += this.tablero.nuevaPosicion(posActual, tirada);
                casillaNueva = this.tablero.getCasilla(posNueva);
                jActual.setPosActual(posNueva);
                informe += `Tras moverse ${tirada} ${tirada === 1 ? 'casilla' : 'casillas'}, ahora está en la posición ${posNueva}. `;
                
                if (casillaNueva instanceof CasillaOca){
                    posNueva = this.tablero.buscarSiguienteOca(posNueva);
                    casillaNueva = this.tablero.getCasilla(posNueva);
                    jActual.setPosActual(posNueva);
                    this.setEstado(EstadoJuego.TIRAR_DADO);
        
                } else if (casillaNueva instanceof CasillaPenalizacion){
                    this.penalizaciones[jActual.getId()] += casillaNueva.penaliza;
                    
                } else if (casillaNueva instanceof CasillaPuente){
                    posNueva = this.tablero.buscarSiguientePuente(posNueva);
                    casillaNueva = this.tablero.getCasilla(posNueva);
                    jActual.setPosActual(posNueva);
        
                } else if (casillaNueva instanceof CasillaVyF) {
                    this.setEstado(EstadoJuego.MINIJUEGO_VF);
                    
                } else if (casillaNueva instanceof CasillaCifras) {
                    this.setEstado(EstadoJuego.MINIJUEGO_CIFRAS);
                    
                } else if (casillaNueva instanceof CasillaUltima) {
                    this.setEstado(EstadoJuego.MINIJUEGO_CASILLA);
                    
                } else if (casillaNueva instanceof CasillaCompas) {
                    this.setEstado(EstadoJuego.MINIJUEGO_COMPAS);
                    
                } else if (casillaNueva instanceof CasillaFechas) {
                    this.setEstado(EstadoJuego.MINIJUEGO_FECHAS);
                }
                
                if (casillaNueva.getId() === "META") {
                    this.setEstado(EstadoJuego.FINALIZADO);
                }
            }
            
            return [casillaNueva, informe];
        } else {
            return null;
        }
    }
    
    /**
     * Crea los participantes (equipos o jugadores) del juego.
     * @param {number} n - El número de participantes a crear (máximo 5).
     * @returns {boolean} - Devuelve true si los participantes fueron creados con éxito, false en caso contrario.
     */
    crearJugadores(n) {
        let ok = false;
        if (n < 6 && this.estado === EstadoJuego.CONFIGURANDO) {
            this.jugadores = [];
            const colores = ['Rojo', 'Azul', 'Verde', 'Morado', 'Naranja', 'Gris'];
            const codigos = ['#FF0000', '#0000FF', '#008000', '#AA00FD', '#FD7D00', '#8C8C8C'];
        
            for (let i = 0; i < n; i++) {
                const color = colores[i];
                const cod = codigos[i];
                this.jugadores.push(new Jugador(i, color, cod, 0, 0, '', 'Salida'));
                this.penalizaciones.push(0);
            }
            
            this.numJugadores = n;
            ok = true;
        }
        return ok;
    }
    
    /**
     * Crea una versión reducida del tablero para comprobar el funcionamiento correcto del juego.
     * @returns {Tablero} - Un tablero de juego de prueba.
     */
    crearTableroPrueba() { 
        let tablero = new Tablero()
        
        tablero.addCasilla(new Casilla("trompo", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/1.jpg", fc[2]));
        tablero.addCasilla(new CasillaFechas("Minijuego fechas", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/2.jpg"));
        tablero.addCasilla(new Casilla("dinero", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/3.jpg", fc[1]));
        tablero.addCasilla(new Casilla("META", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/63.jpg"));
        
        return tablero;
    }

    /**
     * Crea el tablero completo del juego (63 casillas sin contar la de salida, que es la 0).
     * @returns {Tablero} - El tablero definitvo del juego.
     */
    crearTablero() {
        let tablero = new Tablero()
        
        tablero.addCasilla(new Casilla("trompo", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/1.jpg", fc[2]));
        tablero.addCasilla(new CasillaVyF("minijuego verdadero o falso", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/2.jpg"));
        tablero.addCasilla(new Casilla("dinero", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/3.jpg", fc[1]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/4.jpg"));
        tablero.addCasilla(new CasillaOca("Oca 5", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/5.jpg", fc[0]));
        tablero.addCasilla(new CasillaPuente("Puente 6", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/6.jpg"));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/7.jpg"));
        
        tablero.addCasilla(new Casilla("lentejas", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/8.jpg", fc[3]));
        tablero.addCasilla(new CasillaOca("Oca 9", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/9.jpg", fc[0]));
        tablero.addCasilla(new Casilla("queso", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/10.jpg", fc[4]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/11.jpg"));
        tablero.addCasilla(new CasillaPuente("Puente 12", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/12.jpg"));
        tablero.addCasilla(new Casilla("flor", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/13.jpg", fc[5]));
        tablero.addCasilla(new CasillaOca("Oca 14", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/14.jpg", fc[0]));
        
        tablero.addCasilla(new Casilla("maceta", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/15.jpg", fc[6]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/16.jpg"));
        tablero.addCasilla(new Casilla("jamón", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/17.jpg", fc[7]));
        tablero.addCasilla(new CasillaOca("Oca 18", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/18.jpg", fc[0]));
        tablero.addCasilla(new CasillaPenalizacion("hotel", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/19.jpg", fc[19], 2));
        tablero.addCasilla(new Casilla("fútbol", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/20.jpg", fc[8]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/21.jpg"));
        
        tablero.addCasilla(new Casilla("paraguas", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/22.jpg", fc[9]));
        tablero.addCasilla(new CasillaOca("Oca 23", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/23.jpg", fc[0]));
        tablero.addCasilla(new Casilla("fresa", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/24.jpg", fc[10]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/25.jpg"));
        tablero.addCasilla(new Casilla("sombrero", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/26.jpg", fc[11]));
        tablero.addCasilla(new CasillaOca("Oca 27", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/27.jpg", fc[0]));
        tablero.addCasilla(new Casilla("chocolate", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/28.jpg", fc[12]));
        
        tablero.addCasilla(new Casilla("paella", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/29.jpg", fc[13]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/30.jpg"));
        tablero.addCasilla(new CasillaPenalizacion("El pozo", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/31.jpg", fc[20], 2));
        tablero.addCasilla(new CasillaOca("Oca 32", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/32.jpg", fc[0]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/33.jpg"));
        tablero.addCasilla(new Casilla("Granada", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/34.jpg", fc[14]));
        tablero.addCasilla(new Casilla("perro", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/35.jpg", fc[15]));
        
        tablero.addCasilla(new CasillaOca("Oca 36", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/36.jpg", fc[0]));
        tablero.addCasilla(new Casilla("canicas", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/37.jpg", fc[16]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/38.jpg"));
        tablero.addCasilla(new Casilla("rayuela", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/39.jpg", fc[17]));
        tablero.addCasilla(new Casilla("biblioteca", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/40.jpg", fc[18]));
        tablero.addCasilla(new CasillaOca("Oca 41", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/41.jpg", fc[0]));
        tablero.addCasilla(new CasillaPenalizacion("laberinto", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/42.jpg", fc[21], 3));
        
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/43.jpg"));
        tablero.addCasilla(new Casilla("tarta", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/44.jpg", fc[22]));
        tablero.addCasilla(new CasillaOca("Oca 45", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/45.jpg", fc[0]));
        tablero.addCasilla(new Casilla("calcetín", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/46.jpg", fc[23]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/47.jpg"));
        tablero.addCasilla(new Casilla("reloj", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/48.jpg", fc[26]));
        tablero.addCasilla(new Casilla("payaso", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/49.jpg", fc[24]));
        
        tablero.addCasilla(new CasillaOca("Oca 50", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/50.jpg", fc[0]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/51.jpg"));
        tablero.addCasilla(new CasillaPenalizacion("cárcel", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/52.jpg", fc[25], 3));
        tablero.addCasilla(new Casilla("cámara", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/53.jpg", fc[27]));
        tablero.addCasilla(new CasillaOca("Oca 54", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/54.jpg", fc[0]));
        tablero.addCasilla(new Casilla("aceite", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/55.jpg", fc[28]));
        tablero.addCasilla(new Casilla("árbol Navidad", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/56.jpg", fc[29]));
        
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/57.jpg"));
        tablero.addCasilla(new Casilla("limón", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/58.jpg", fc[30]));
        tablero.addCasilla(new CasillaOca("Oca 59", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/59.jpg", fc[0]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/60.jpg"));
        tablero.addCasilla(new Casilla("gato", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/61.jpg", fc[31]));
        tablero.addCasilla(new Casilla("cometa", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/62.jpg", fc[32]));
        tablero.addCasilla(new Casilla("META", "https://bucket-oca.s3.eu-west-1.amazonaws.com/casillas-oca/63.jpg"));
        
        return tablero;
    }
}

module.exports = {
    JuegoOca
};
