const {Casilla, CasillaOca, CasillaPuente, CasillaPenalizacion, CasillaVyF, CasillaFechas} = require('./Casillas.js')
const fc = require('./exports/frasesCasillas.json')

class Tablero {
    constructor() {
        this.tablero = [];
        this.addCasilla(new Casilla("Salida", "https://i.ibb.co/Yfmk5mt/oca.png"));
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
    
    buscarSiguienteOca(posActual) {
        for (let i = posActual + 1; i < this.tablero.length; i++) {
            if (this.tablero[i] instanceof CasillaOca) {
                return i;
            } else if (i === (this.tablero.length-1)) {
                return (this.tablero.length-1);
            }
        }
        return null;
    }
    
    buscarSiguientePuente(posActual) {
        for (let i = 0; i < this.tablero.length; i++) {
            if (this.tablero[i] instanceof CasillaPuente && i !== posActual) {
                return i;
            }
        }
        return null;
    }
    
}

function crearTableroPrueba() { //unas 44 normales+minijuegos aprox (20-22 cada una)
    
    let tablero = new Tablero()
    
    //Salida[0] añadida en constructor de Tablero
    //...[1-3] (3)
    tablero.addCasilla(new Casilla("Casilla 1", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    tablero.addCasilla(new Casilla("Casilla 2", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    tablero.addCasilla(new Casilla("Casilla 3", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    //Oca[4]
    tablero.addCasilla(new CasillaOca("Oca 4", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg"));
    //Puente[5]
    tablero.addCasilla(new CasillaPuente("Puente 5", "https://i.ibb.co/QNCNpvZ/casilla-puente.jpg"));
    //...[6-7]
    tablero.addCasilla(new Casilla("Casilla 6", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    tablero.addCasilla(new Casilla("Casilla 7", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    //Oca[8]
    tablero.addCasilla(new CasillaOca("Oca 8", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg"));
    //...[9-10]
    tablero.addCasilla(new CasillaPenalizacion("Casilla 9", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", 2));
    tablero.addCasilla(new Casilla("Casilla 10", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    // Puente[11]
    tablero.addCasilla(new CasillaPuente("Puente 11", "https://i.ibb.co/QNCNpvZ/casilla-puente.jpg"));
    //Oca[12]
    tablero.addCasilla(new CasillaOca("Oca 12", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg"));
    //...[13-14]
    tablero.addCasilla(new Casilla("Casilla 13", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    tablero.addCasilla(new Casilla("Casilla 14", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    // Meta[15]
    tablero.addCasilla(new Casilla("META", "https://i.ibb.co/MpFDM44/casilla-meta.jpg"));
    
    return tablero;
    
}


function crearTablero() {
    
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

module.exports = {
    crearTableroPrueba,
    crearTablero
};

