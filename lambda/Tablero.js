const {Casilla, CasillaOca, CasillaPuente, CasillaPenalizacion} = require('./Casillas.js')

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
    
}

function crearTableroPrueba() {
    
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
    tablero.addCasilla(new CasillaPenalizacion("Casilla 9", "https://i.ibb.co/PC2K0bL/casilla-pozo.jpg"));
    tablero.addCasilla(new Casilla("Casilla 10", "https://i.ibb.co/gd6skr2/casilla-normal.jpg"));
    // Puente[11]
    tablero.addCasilla(new CasillaPuente("Puente 11", "https://i.ibb.co/QNCNpvZ/casilla-puente.jpg"));
    //Oca[12]
    tablero.addCasilla(new CasillaOca("Oca 12", "https://i.ibb.co/N6ytQXr/casilla-oca.jpg"));
    // Meta[13]
    tablero.addCasilla(new Casilla("META", "https://i.ibb.co/MpFDM44/casilla-meta.jpg"));
    
    return tablero;
    
}


function crearTablero() {
    
    let tablero = new Tablero()
    /*
    //Salida[0] añadida en constructor de Tablero
    //...[1-3] (3)
    tablero.addCasilla(new Casilla("C1"));
    tablero.addCasilla(new Casilla("C2"));
    tablero.addCasilla(new Casilla("C3"));
    //Oca[4]
    tablero.addCasilla(new CasillaOca("Oca-4"));
    //Puente[5]
    tablero.addCasilla(new CasillaPuente("Puente-5"));
    //...[6-7]
    tablero.addCasilla(new Casilla("C6"));
    tablero.addCasilla(new Casilla("C7"));
    //Oca[8]
    tablero.addCasilla(new CasillaOca("Oca-8"));
    //...[9-10]
    tablero.addCasilla(new Casilla("C9"));
    tablero.addCasilla(new Casilla("C10"));
    //Puente[11]
    tablero.addCasilla(new CasillaPuente("Puente-11"));
    //...[12]
    tablero.addCasilla(new Casilla("C12"));
    //Oca[13]
    tablero.addCasilla(new CasillaOca("Oca-13"));
    //...[14-16]
    tablero.addCasilla(new Casilla("C14"));
    tablero.addCasilla(new Casilla("C15"));
    tablero.addCasilla(new Casilla("C16"));
    //Oca[17]
    tablero.addCasilla(new CasillaOca("Oca-17"));
    //Posada/hotel[18]
    
    //...[19-21]
    tablero.addCasilla(new Casilla("C19"));
    tablero.addCasilla(new Casilla("C21"));
    tablero.addCasilla(new Casilla("C22"));
    //Oca[22]
    tablero.addCasilla(new CasillaOca("Oca-22"));
    //...[23-25]
    tablero.addCasilla(new Casilla("C23"));
    tablero.addCasilla(new Casilla("C24"));
    tablero.addCasilla(new Casilla("C25"));
    //Oca[26]
    tablero.addCasilla(new CasillaOca("Oca-26"));
    //...[27-29]
    tablero.addCasilla(new Casilla("C27"));
    tablero.addCasilla(new Casilla("C28"));
    tablero.addCasilla(new Casilla("C29"));
    //Pozo[30]
    
    //Oca[31]
    tablero.addCasilla(new CasillaOca("Oca-31"));
    //...[32-34]
    tablero.addCasilla(new Casilla("C32"));
    tablero.addCasilla(new Casilla("C33"));
    tablero.addCasilla(new Casilla("C34"));
    //Oca[35]
    tablero.addCasilla(new CasillaOca("Oca-35"));
    //...[36-39]
    tablero.addCasilla(new Casilla("C36"));
    tablero.addCasilla(new Casilla("C37"));
    tablero.addCasilla(new Casilla("C38"));
    tablero.addCasilla(new Casilla("C39"));
    //Oca[40]
    tablero.addCasilla(new CasillaOca("Oca-40"));
    //Laberinto[41]
    //...[42-43]
    tablero.addCasilla(new Casilla("C42"));
    tablero.addCasilla(new Casilla("C43"));
    //Oca[44]
    tablero.addCasilla(new CasillaOca("Oca-44"));
    //...[45-48]
    tablero.addCasilla(new Casilla("C45"));
    tablero.addCasilla(new Casilla("C46"));
    tablero.addCasilla(new Casilla("C47"));
    tablero.addCasilla(new Casilla("C48"));
    //Oca[49]
    tablero.addCasilla(new CasillaOca("Oca-49"));
    //...[50]
    tablero.addCasilla(new Casilla("C50"));
    //Cárcel[51]
    
    //...[52]
    tablero.addCasilla(new Casilla("C52"));
    //Oca[53]
    tablero.addCasilla(new CasillaOca("Oca-53"));
    //...[54-56]
    tablero.addCasilla(new Casilla("C54"));
    tablero.addCasilla(new Casilla("C55"));
    tablero.addCasilla(new Casilla("C56"));
    //Calavera[57]
    
    //Oca[58]
    tablero.addCasilla(new CasillaOca("Oca-58"));
    //...[59-62]
    tablero.addCasilla(new Casilla("C59"));
    tablero.addCasilla(new Casilla("C60"));
    tablero.addCasilla(new Casilla("C61"));
    tablero.addCasilla(new Casilla("C62"));
    // Meta[63]
    tablero.addCasilla(new Casilla("META"));
    */
    return tablero;
    
    
}

module.exports = {
    crearTableroPrueba
};

