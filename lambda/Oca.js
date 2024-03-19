const {Casilla} = require('./Casillas.js')

class Tablero {
    constructor() {
        this.tablero = [];
        this.addCasilla(new Casilla("Salida"));
    }

    addCasilla(casilla) {
        this.tablero.push(casilla);
    }

    getCasilla(numCasilla) {
        if (this.correcto(numCasilla)) {
            return this.tablero[numCasilla];
        } else {
            return null;
        }
    }

    getCasillas() {
        return this.tablero;
    }

    nuevaPosicion(actual, tirada) {
        let nueva_pos = actual + tirada;
        if (nueva_pos >= this.tablero.length) {
            let restantes = this.tablero.length - actual;
            let retrocede = tirada - restantes;
            nueva_pos = (this.tablero.length - 1) - retrocede ;
        }
        return nueva_pos;
    }

    correcto(numCasilla) {
        return numCasilla >= 0 && numCasilla < this.tablero.length;
    }
}


function crearTablero() {
    
    let tablero = new Tablero()
    
    //Salida[0] añadida en constructor de Tablero
    //...[1-3] (3)
    tablero.addCasilla(new Casilla("C1"));
    tablero.addCasilla(new Casilla("C2"));
    tablero.addCasilla(new Casilla("C3"));
    //Oca[4]
    tablero.addCasilla(new Casilla("Oca-4"));
    
    return tablero;
    
}

function avanzaJugador(jActual, tirada, tablero, jugadores){
   let posActual = jActual.getPosActual();
   let posNueva = tablero.nuevaPosicion(posActual, tirada);
   let casilla = tablero.getCasilla(posNueva);
   jActual.setPosActual(posNueva);
   //casilla.recibeJugador(, jugadores);
}
    
function pasarTurno(jActual, jugadores){
    let n = jActual + 1;
    if (n >= jugadores.length())
        jActual = 0;
    else
        jActual += 1;
        
    return jActual;
}

function tirarUnDado() {
    return Math.floor(Math.random() * 6) + 1;
}

function getImgDado(d){
    let url = '';
    switch (d) {
     case 1:
        url = "https://i.ibb.co/L6LWH6J/uno.png";
        break;
     case 2:
        url = "https://i.ibb.co/6BtGz7w/dos.png";
        break;
     case 3:
        url = "https://i.ibb.co/5LVtjC0/tres.png";
        break;
     case 4:
        url = "https://i.ibb.co/KybnbJC/cuatro.png";
        break;
     case 5:
        url = "https://i.ibb.co/3vmVrXS/cinco.png";
        break;
     case 6:
        url = "https://i.ibb.co/JdPSLq6/seis.png";
        break;
    }
    return url;
}

module.exports = {
    crearTablero,
    tirarUnDado,
    getImgDado
};