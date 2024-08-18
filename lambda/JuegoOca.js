const {EstadoJuego} = require('./EstadoJuego.js');
const {Tablero} = require('./Tablero.js');
const {Jugador} = require('./Jugador.js');
const {Casilla, CasillaOca, CasillaPuente, CasillaPenalizacion, CasillaCompas,
       CasillaVyF, CasillaCifras, CasillaUltima, CasillaFechas} = require('./Casillas.js');
const fc = require('./exports/frasesCasillas.json');

class JuegoOca {
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
    
    setEquipos(hayEquipos) {
        this.hayEquipos = hayEquipos;
    }
    
    getEquipos() {
        return this.hayEquipos;
    }
    
    getTurno() {
       return this.turno;
    }
    
    getRonda() {
        return this.ronda;
    }
    
    setEstado(estado) {
        this.estado = estado;
    }
    
    getEstado() {
        return this.estado;
    }
    
    getJugador(i) {
        if (i >= 0 && i < this.numJugadores)
            return this.jugadores[i];
        else
            return null;
    }
    
    getJugadorActual() {
        return this.jugadores[this.turno];
    }
    
    getNombreJActual() {
        return this.jugadores[this.turno].getNombre();
    }
    
    getJugadores() {
        return this.jugadores;
    }
    
    getJugadorCasilla(numCasilla) {
        const jugEnCasilla = this.jugadores.filter(jugador => jugador.posicion === numCasilla);
    
        return jugEnCasilla;
    }
    
    getJugadoresCasilla(numCasilla, jActual) {
        const jugadoresEnCasilla = this.jugadores.filter(jugador => jugador.posicion === numCasilla && jugador !== jActual);
        
        return jugadoresEnCasilla;
    }
    
    getNumJugadores() {
        return this.numJugadores;
    }
    
    getCompas(jActual) {
        const compas = this.jugadores.filter(jugador => jugador !== jActual);
        
        return compas; 
    }
    
    setPenalizaciones(idJugador, valor) {
        this.penalizaciones[valor];
    }
    
    getPenalizaciones(idJugador) {
        return this.penalizaciones[idJugador];
    }
    
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
    
    calcularRebote(jActual) {
        let sig = jActual + 1;
        if (sig >= this.numJugadores)
            sig = 0;
            
        return sig;
    }
    
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
    
    avanzaJugador(jActual, tirada, jugEnCasilla){
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
                informe += `Tras moverse ${tirada} ${tirada === 1 ? 'casilla' : 'casillas'}, ahora está en la casilla ${posNueva}. `;
                
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
                    
                } else if ((casillaNueva instanceof CasillaOca)) {
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
    
    crearJugadores(n) {
        let ok = false;
        if (n < 6 && this.estado === EstadoJuego.CONFIGURANDO) {
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
    
    crearTableroPrueba() { 
        let tablero = new Tablero()
        
        tablero.addCasilla(new Casilla("trompo", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[2]));
        tablero.addCasilla(new CasillaCompas("Minijuego compañeros", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        //tablero.addCasilla(new CasillaCifras("Minijuego fechas", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new CasillaUltima("Minijuego última casilla", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("tesoro", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[1]));
        tablero.addCasilla(new Casilla("META", "https://i.ibb.co/MpFDM44/casilla-meta.jpg"));
        
        return tablero;
    }

    crearTablero() { //unas 44 normales+minijuegos aprox (20-22 cada una)
        let tablero = new Tablero()
        
        //Salida[0] añadida en constructor de Tablero
        //...[1-3] (3)
        tablero.addCasilla(new Casilla("trompo", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[2]));
        tablero.addCasilla(new CasillaCifras("Minijuego fechas", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("tesoro", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[1]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        //Oca[5]
        tablero.addCasilla(new CasillaOca("Oca 5", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //Puente[6]
        tablero.addCasilla(new CasillaPuente("Puente 6", "https://i.ibb.co/QNCNpvZ/casilla-puente.jpg"));
        //...[7-8]
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("lentejas", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[3]));
        //Oca[9]
        tablero.addCasilla(new CasillaOca("Oca 9", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[10-11]
        tablero.addCasilla(new Casilla("queso", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[4]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        //Puente[12]
        tablero.addCasilla(new CasillaPuente("Puente 12", "https://i.ibb.co/QNCNpvZ/casilla-puente.jpg"));
        //...[13]
        tablero.addCasilla(new Casilla("banco", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[5]));
        //Oca[14]
        tablero.addCasilla(new CasillaOca("Oca 14", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[15-17]
        tablero.addCasilla(new Casilla("jardín", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[6]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("jamón", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[7]));
        //Oca[18]
        tablero.addCasilla(new CasillaOca("Oca 18", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //Posada/hotel[19]
        tablero.addCasilla(new CasillaPenalizacion("La posada", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", fc[19], 2));
        //...[20-22]
        tablero.addCasilla(new Casilla("fútbol", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[8]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("paraguas", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[9]));
        //Oca[23]
        tablero.addCasilla(new CasillaOca("Oca 23", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[24-26]
        tablero.addCasilla(new Casilla("fruta", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[10]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("sombrero", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[11]));
        //Oca[27]
        tablero.addCasilla(new CasillaOca("Oca 27", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[28-30]
        tablero.addCasilla(new Casilla("chocolate", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[12]));
        tablero.addCasilla(new Casilla("paella", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[13]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        //Pozo[31]
        tablero.addCasilla(new CasillaPenalizacion("El pozo", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", fc[20], 2));
        //Oca[32]
        tablero.addCasilla(new CasillaOca("Oca 32", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[33-35]
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("Granada", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[14]));
        tablero.addCasilla(new Casilla("perro", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[15]));
        //Oca[36]
        tablero.addCasilla(new CasillaOca("Oca 36", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[37-40]
        tablero.addCasilla(new Casilla("canicas", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[16]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("rayuela", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[17]));
        tablero.addCasilla(new Casilla("biblioteca", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[18]));
        //Oca[41]
        tablero.addCasilla(new CasillaOca("Oca 41", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //Laberinto[42]
        tablero.addCasilla(new CasillaPenalizacion("El laberinto", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", fc[21], 3));
        //...[43-44]
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("tarta", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[22]));
        //Oca[45]
        tablero.addCasilla(new CasillaOca("Oca 45", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[46-49]
        tablero.addCasilla(new Casilla("calcetín", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[23]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("reloj", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[26]));
        tablero.addCasilla(new Casilla("payaso", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[24]));
        //Oca[50]
        tablero.addCasilla(new CasillaOca("Oca 50", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[51]
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        //Cárcel[52]
        tablero.addCasilla(new CasillaPenalizacion("La cárcel", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", fc[25], 3));
        //...[53]
        tablero.addCasilla(new Casilla("cámara", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[27]));
        //Oca[54]
        tablero.addCasilla(new CasillaOca("Oca 54", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[55-57]
        tablero.addCasilla(new Casilla("piscina", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[28]));
        tablero.addCasilla(new Casilla("árbol de Navidad", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[29]));
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        //Serpiente[58]
        tablero.addCasilla(new CasillaPenalizacion("La serpiente", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", fc[0], 3));
        //Oca[59]
        tablero.addCasilla(new CasillaOca("Oca 59", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", fc[0]));
        //...[60-62]
        tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
        tablero.addCasilla(new Casilla("gato", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[31]));
        tablero.addCasilla(new Casilla("cometa", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[32]));
        // Meta[63]
        tablero.addCasilla(new Casilla("META", "https://i.ibb.co/MpFDM44/casilla-meta.jpg"));
        
        return tablero;
    }
}

module.exports = {
    JuegoOca
};
