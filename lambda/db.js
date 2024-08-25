const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const {Jugador} = require('./Jugador.js');
const {JuegoOca} = require('./JuegoOca.js');

async function asumirRol() {
    const arnRol = 'arn:aws:iam::533267233233:role/rol-dynamo';

    const STS = new AWS.STS({ apiVersion: '2011-06-15' });

    const credentials = await STS.assumeRole({
        RoleArn: arnRol,
        RoleSessionName: 'sesionRol'
    }, (err, res) => {
        if (err) {
            console.log('asumirRol ERROR: ', err);
            throw new Error('Error al intentar asumir rol');
        }
        return res;
    }).promise();
    
    const db = new AWS.DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        accessKeyId: credentials.Credentials.AccessKeyId,
        secretAccessKey: credentials.Credentials.SecretAccessKey,
        sessionToken: credentials.Credentials.SessionToken
    });

    return db;
}

async function guardarPartida(db, juegoOca) {
    let txt = '';
    const params = {
        TableName: 'JuegoOca',
        Item: {
            idJuego: 0,
            estado: juegoOca.estado,  
            hayEquipos: juegoOca.hayEquipos,
            numJugadores: juegoOca.numJugadores,
            ronda: juegoOca.ronda,
            turno: juegoOca.turno
        }
    };
    
    try {
        await db.put(params).promise();
        txt += 'Datos de la partida guardados con éxito en DynamoDB. ';
    } catch (error) {
        console.error('Error al guardar los datos de la partida en DynamoDB:', error);
        txt += `Error al guardar los datos de la partida: ${error.message}`;
    }
    txt += await guardarJugadores(db, juegoOca);
    
    return txt;
}

async function guardarJugadores(db, juegoOca) {
    const njugadores = juegoOca.getNumJugadores();
    let txt = '';
    for (let i = 0; i < njugadores; i++) {
        const jugador = juegoOca.getJugador(i);
        const penaliz = juegoOca.penalizaciones[i];

        const params = {
            TableName: 'Jugador',
            Item: {
                idJugador: jugador.id,
                nombreColor: jugador.color,  
                codigoColor: jugador.codigo,
                posicion: jugador.posicion,
                puntos: jugador.puntos,
                nombre: jugador.nombre,
                penalizaciones: penaliz,
                ultimaCasilla: jugador.ultimaCasilla
            }
        };
    
        try {
            await db.put(params).promise();
            txt += 'Participante ' + i + ' guardado con éxito. ';
        } catch (error) {
            console.error('Error al guardar participante ' + i + ' en DynamoDB:', error);
            txt += `Error al guardar participante ${i}: ${error.message}`;
        }
    }
    return txt;
}

async function cargarPartida(db, juegoOca) {
    let txt = '';
    try {
        const params = {
            TableName: 'JuegoOca',
            Key: {
                idJuego: 0
            }
        };

        const result = await db.get(params).promise();

        if (result.Item) {
            const datos = result.Item;
            juegoOca.hayEquipos = datos.hayEquipos;
            juegoOca.numJugadores = datos.numJugadores;
            juegoOca.crearJugadores(datos.numJugadores);
            juegoOca.ronda = datos.ronda;
            juegoOca.turno = datos.turno;
            juegoOca.estado = datos.estado;
            
            txt += `Datos de la partida cargados con éxito. `;
        } else {
            txt += 'Conexión exitosa, pero no hay ítem.';
        }
    } catch (error) {
        txt += `Error al conectar con DynamoDB: ${error.message}`;
    }
    
    txt += await cargarJugadores(db, juegoOca);
    
    return txt;
}

async function cargarJugadores(db, juegoOca) {
    const njugadores = juegoOca.getNumJugadores();
    let txt = '';
    for (let i = 0; i < njugadores; i++) {
        try {
            const params = {
                TableName: 'Jugador',
                Key: {
                    idJugador: i
                }
            };
    
            const result = await db.get(params).promise();
    
            if (result.Item) {
                const datos = result.Item;
                juegoOca.getJugador(i).setId(datos.idJugador);
                juegoOca.getJugador(i).setNombre(datos.nombre);
                juegoOca.getJugador(i).setColor(datos.nombreColor);
                juegoOca.getJugador(i).setCodigo(datos.codigoColor);
                juegoOca.penalizaciones[i] = datos.penalizaciones;
                juegoOca.getJugador(i).setPosActual(datos.posicion);
                juegoOca.getJugador(i).setPuntos(datos.puntos);
                juegoOca.getJugador(i).setUltimaCasilla(datos.ultimaCasilla);
                
                txt += `Datos de participante ${i} cargados con éxito. `;
            } else {
                txt += 'Conexión exitosa, pero no hay ítem.';
            }
        } catch (error) {
            txt += `Error al conectar con DynamoDB: ${error.message}`;
        }
    }
    return txt;
}

module.exports = {
    asumirRol,
    guardarPartida,
    cargarPartida
};

