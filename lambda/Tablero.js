const {Casilla, CasillaOca, CasillaPuente, CasillaPenalizacion, CasillaVyF} = require('./Casillas.js')
const {fc1, fc2} = require('./exports/frasesCasillas.js')

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
    tablero.addCasilla(new Casilla("Casilla 1", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 2", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 3", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[4]
    tablero.addCasilla(new CasillaOca("Oca 4", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //Puente[5]
    tablero.addCasilla(new CasillaPuente("Puente 5", "https://i.ibb.co/QNCNpvZ/casilla-puente.jpg", ''));
    //...[6-7]
    tablero.addCasilla(new CasillaVyF("Minijuego VyF", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", ''));
    tablero.addCasilla(new Casilla("Casilla 7", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[8]
    tablero.addCasilla(new CasillaOca("Oca 8", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[9-10]
    tablero.addCasilla(new Casilla("Casilla 9", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 10", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Puente[11]
    tablero.addCasilla(new CasillaPuente("Puente 11", "https://i.ibb.co/QNCNpvZ/casilla-puente.jpg", ''));
    //...[12]
    tablero.addCasilla(new Casilla("Casilla 12", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[13]
    tablero.addCasilla(new CasillaOca("Oca 13", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[14-16]
    tablero.addCasilla(new Casilla("Casilla 14", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 15", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 16", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[17]
    tablero.addCasilla(new CasillaOca("Oca 17", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //Posada/hotel[18]
    tablero.addCasilla(new CasillaPenalizacion("La posada", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", '', 2));
    //...[19-21]
    tablero.addCasilla(new Casilla("Casilla 19", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 20", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 21", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 22", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[22]
    tablero.addCasilla(new CasillaOca("Oca 22", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[23-25]
    tablero.addCasilla(new Casilla("Casilla 23", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 24", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 25", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[26]
    tablero.addCasilla(new CasillaOca("Oca 26", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[27-29]
    tablero.addCasilla(new Casilla("Casilla 27", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 28", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 29", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Pozo[30]
    tablero.addCasilla(new CasillaPenalizacion("El pozo", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", '', 2));
    //Oca[31]
    tablero.addCasilla(new CasillaOca("Oca 31", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[32-34]
    tablero.addCasilla(new Casilla("Casilla 32", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 33", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 34", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[35]
    tablero.addCasilla(new CasillaOca("Oca 35", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[36-39]
    tablero.addCasilla(new Casilla("Casilla 36", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 37", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 38", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 39", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[40]
    tablero.addCasilla(new CasillaOca("Oca 40", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //Laberinto[41]
    tablero.addCasilla(new CasillaPenalizacion("El laberinto", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", '', 3));
    //...[42-43]
    tablero.addCasilla(new Casilla("Casilla 42", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 43", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[44]
    tablero.addCasilla(new CasillaOca("Oca 44", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[45-48]
    tablero.addCasilla(new Casilla("Casilla 45", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 46", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 47", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 48", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[49]
    tablero.addCasilla(new CasillaOca("Oca 49", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[50]
    tablero.addCasilla(new Casilla("Casilla 50", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Cárcel[51]
    tablero.addCasilla(new CasillaPenalizacion("La cárcel", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", '', 3));
    //...[52]
    tablero.addCasilla(new Casilla("Casilla 52", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Oca[53]
    tablero.addCasilla(new CasillaOca("Oca 53", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[54-56]
    tablero.addCasilla(new Casilla("Casilla 54", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 55", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 56", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    //Calavera[57]
    tablero.addCasilla(new CasillaPenalizacion("La casilla trampa", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg", '', 3));
    //Oca[58]
    tablero.addCasilla(new CasillaOca("Oca 58", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg", ''));
    //...[59-62]
    tablero.addCasilla(new Casilla("Casilla 59", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 60", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 61", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    tablero.addCasilla(new Casilla("Casilla 62", "https://i.ibb.co/gd6skr2/casilla-normal.jpg", fc2));
    // Meta[63]
    tablero.addCasilla(new Casilla("META", "https://i.ibb.co/MpFDM44/casilla-meta.jpg", ''));
    
    return tablero;
    
    
}

module.exports = {
    crearTableroPrueba,
    crearTablero
};

