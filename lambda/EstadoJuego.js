const EstadoJuego = {
    INDETERMINADO: 'INDETERMINADO',
    CONFIGURANDO: 'CONFIGURANDO',
    REGISTRO_NOMBRES: 'REGISTRO_NOMBRES',
    TIRAR_DADO: 'TIRAR_DADO',
    MOVER_FICHA: 'MOVER_FICHA',
    MINIJUEGO_VF: 'MINIJUEGO_VF',
    MINIJUEGO_CIFRAS: 'MINIJUEGO_CIFRAS',
    MINIJUEGO_COMPAS: 'MINIJUEGO_COMPAS',
    MINIJUEGO_FECHAS: 'MINIJUEGO_FECHAS',
    MINIJUEGO_CASILLA: 'MINIJUEGO_CASILLA',
    FINALIZADO: 'FINALIZADO'
};

function informeEstado(estado, hayEquipos = false, nombreJ = '', pregunta = '') {
    let mensaje;
    switch (estado) {
        case EstadoJuego.CONFIGURANDO:
            mensaje = 'Se está creando una nueva partida. Registre los datos que se le indican para completar la configuración. ';
            break;
        case EstadoJuego.REGISTRO_NOMBRES:
            mensaje = `Se está registrando el nombre de los ${hayEquipos ? 'equipos' : 'participantes'}. Para registrar el nombre,
                       cada uno debe decir: '${hayEquipos ? 'Nuestro' : 'Mi'} nombre es', seguido del nombre elegido. Por ejemplo, \
                       '${hayEquipos ? 'Nuestro' : 'Mi'} nombre es '${hayEquipos ? 'Amantes de la paella' : 'Roberta'}. `;
            break;
        case EstadoJuego.TIRAR_DADO:
            mensaje = `Es el turno de ${nombreJ}. Por favor, ${hayEquipos ? 'decid' : 'di'} 'Tirar dado' para ver el número de casillas a avanzar. `;
            break;
        case EstadoJuego.MOVER_FICHA:
            mensaje = `Es el turno de ${nombreJ}. Por favor, ${hayEquipos ? 'decid' : 'di'} 'Mover ficha' para poder avanzar en el tablero. `;
            break;
        case EstadoJuego.MINIJUEGO_VF:
            mensaje = `Estamos en el minijuego de Verdadero o falso. ${nombreJ}, responda${hayEquipos ? 'n' : ''} con 'verdadero' o 'falso'. Si la respuesta es correcta,  \
                       ${hayEquipos ? 'ganaréis' : 'ganarás'} 10 puntos. ${pregunta}. `;
            break;
        case EstadoJuego.MINIJUEGO_CIFRAS:
            mensaje = `Estamos en el minijuego de Adivina la cifra. ${nombreJ}, responda${hayEquipos ? 'n' : ''} con el número que pensáis que es correcto. Si  \
                       ${hayEquipos ? 'acertáis, ganaréis' : 'aciertas, ganarás'} 30 puntos, si no, la pregunta rebotará al siguiente ${hayEquipos ? 'equipo ' : 'participante'}. \
                       La pregunta es: ${pregunta}. `;
            break;
        case EstadoJuego.MINIJUEGO_FECHAS:
            mensaje = `Estamos en el minijuego de Recuerda la fecha. ${nombreJ}, responda${hayEquipos ? 'n' : ''} con el día de la semana, mes, o estación del año que considere${hayEquipos ? 'n ' : ' '} \
                       adecuada. Si la respuesta es correcta, ${hayEquipos ? 'ganaréis' : 'ganarás'} 20 puntos. ${pregunta}. `;
            break;
        case EstadoJuego.MINIJUEGO_CASILLA:
            mensaje = `Estamos en el minijuego de Recuerda la última casilla. ${nombreJ}, responda${hayEquipos ? 'n' : ''} con el nombre de la casilla en la que estaba${hayEquipos ? 'n' : ''}, \
                       antes de caer en la actual. Si ${hayEquipos ? ' acertáis, ganaréis ' : ' aciertas, ganarás '} 25 puntos. Si por el contrario, no  \
                       ${hayEquipos ? ' os acordáis del ' : ' recuerdas el '} nombre, ${hayEquipos ? ' decid ' : ' di '} 'No me acuerdo de la casilla'. `;
            break;
        case EstadoJuego.MINIJUEGO_COMPAS:
            mensaje = `Estamos en el minijuego de Conoce a tus compañeros. ${nombreJ}, responda${hayEquipos ? 'n' : ''} con 'correcto' o 'incorrecto'. ${pregunta} `;
            break;
        case EstadoJuego.FINALIZADO:
            mensaje = 'El juego ha finalizado, gracias por jugar. Si quiere crear una partida nueva, diga: Nueva partida. ';
            break;
        default:
            mensaje = 'Estado de juego desconocido. '
            break;
    }
    return mensaje;
}

module.exports = {
    EstadoJuego,
    informeEstado
};
