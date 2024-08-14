const {Tablero} = require('./Tablero.js');
const {Jugador} = require('./Jugador.js');
const {Casilla, CasillaOca, CasillaPuente, CasillaPenalizacion, CasillaVyF, CasillaFechas} = require('./Casillas.js');
const fc = require('./exports/frasesCasillas.json');

class JuegoOca {
    constructor() {
        this.hayEquipos = false;
        this.jugadores = [];
        this.numJugadores = 0;
        this.turno = 0;
        this.penalizaciones = [];
        this.tablero = this.crearTablero();
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
    
    getJugadoresCasilla(numCasilla, jActual) {
        const jugadoresEnCasilla = this.jugadores.filter(jugador => jugador.posicion === numCasilla && jugador !== jActual);
        let mensaje = '';

        if (jugadoresEnCasilla.length === 1) {
            const nombreJugador = jugadoresEnCasilla[0].nombre;
            mensaje += ` ¡Qué casualidad! En esta casilla también ${this.hayEquipos ? ' están ' : ' está '} ${nombreJugador}. `;
        } else if (jugadoresEnCasilla.length > 1) {
            const nombresJugadores = jugadoresEnCasilla.map(jugador => jugador.nombre).join(', ');
            mensaje += ` ¡Qué casualidad! En esta casilla también están los siguientes ${this.hayEquipos ? ' equipos' : ' jugadores' }: ${nombresJugadores}. `;
        }
    
        return [jugadoresEnCasilla, mensaje];
    }
    
    getNumJugadores() {
        return this.numJugadores;
    }
    
    setPenalizaciones(idJugador, valor) {
        this.penalizaciones[valor];
    }
    
    getPenalizaciones(idJugador) {
        return this.penalizaciones[idJugador];
    }
    
    pasarTurno() {
        let sig = this.turno + 1;
        if (sig >= this.numJugadores)
            sig = 0;
            
        this.turno = sig;
    }
    
    calcularRebote(jActual) {
        let sig = jActual + 1;
        if (sig >= this.numJugadores)
            sig = 0;
            
        return sig;
    }
    
    avanzaJugador(jActual, tirada){
        let finPartida = false;
        let dobleTurno = false;
        let minijuego = 0;
        let posNueva = 0;
        let posActual = jActual.getPosActual();
        let casillaNueva;
        let informe = `${this.hayEquipos ? 'El equipo' : ''} ${jActual.nombre} estaba en la casilla ${posActual}. `;
        
        if (this.tablero.getCasilla(posActual) instanceof CasillaPenalizacion && this.penalizaciones[jActual.id] > 0){
            posNueva = posActual;
            casillaNueva = this.tablero.getCasilla(posNueva);
            informe += `${this.hayEquipos ? 'El equipo' : ''} ${jActual.nombre} no puede moverse aún. ${this.penalizaciones[jActual.id] === 1 ? 'Queda' : 'Quedan'} ${this.penalizaciones[jActual.id]} \
                        ${this.penalizaciones[jActual.id] === 1 ? 'turno' : 'turnos'} antes de poder volver a tirar el dado. `
            this.penalizaciones[jActual.id] -= 1;
        } else {
            posNueva += this.tablero.nuevaPosicion(posActual, tirada);
            casillaNueva = this.tablero.getCasilla(posNueva);
            jActual.setPosActual(posNueva);
            informe += `Tras moverse ${tirada} ${tirada === 1 ? 'casilla' : 'casillas'}, ahora está en la casilla ${posNueva}. `;
            informe += casillaNueva.recibeJugador(jActual, this.hayEquipos);
            
            if (casillaNueva instanceof CasillaOca){
                posNueva = this.tablero.buscarSiguienteOca(posNueva);
                casillaNueva = this.tablero.getCasilla(posNueva);
                jActual.setPosActual(posNueva);
                dobleTurno = true;
    
            } else if (casillaNueva instanceof CasillaPenalizacion){
                this.penalizaciones[jActual.id] += casillaNueva.penaliza;
                
            } else if (casillaNueva instanceof CasillaPuente){
                posNueva = this.tablero.buscarSiguientePuente(posNueva);
                casillaNueva = this.tablero.getCasilla(posNueva);
                jActual.setPosActual(posNueva);
    
            } else if (casillaNueva instanceof CasillaVyF) {
                minijuego = 1;
                
            } else if (casillaNueva instanceof CasillaFechas) {
                minijuego = 2;
            }
            
            
            if (casillaNueva.id === "META"){
                informe += `${casillaNueva.id}. ¡Felicidades ${jActual.nombre}, ${this.hayEquipos ? 'habéis' : 'has'} ganado la partida! `;
                finPartida = true;
            }
        }
        return [casillaNueva, informe, finPartida, dobleTurno, minijuego];
    }
    
    crearJugadores(n) {
        let ok = false;
        if (n < 6) {
            const colores = ['Rojo', 'Azul', 'Verde', 'Morado', 'Naranja', 'Gris'];
            const codigos = ['#FF0000', '#0000FF', '#008000', '#AA00FD', '#FD7D00', '#8C8C8C'];
        
            for (let i = 0; i < n; i++) {
                const color = colores[i];
                const cod = codigos[i];
                this.jugadores.push(new Jugador(i, color, cod, 0, 0, ''));
                this.penalizaciones.push(0);
            }
            
            this.numJugadores = n;
            ok = true;
        }
        return ok;
    }
    
    crearTablero() {
        let tablero = new Tablero()
        
        //Salida[0] añadida en constructor de Tablero
        //...[1-3] (3)
        tablero.addCasilla(new Casilla("trompo", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc[2]));
        tablero.addCasilla(new CasillaFechas("Minijuego fechas", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
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