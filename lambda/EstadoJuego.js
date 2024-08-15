const EstadoJuego = {
    INDETERMINADO: 'INDETERMINADO',
    CONFIGURANDO: 'CONFIGURANDO',
    REGISTRO_NOMBRES: 'REGISTRO_NOMBRES',
    TIRAR_DADO: 'TIRAR_DADO',
    MOVER_FICHA: 'MOVER_FICHA',
    MINIJUEGO_VF: 'MINIJUEGO_VF',
    MINIJUEGO_CIFRAS: 'MINIJUEGO_CIFRAS',
    MINIJUEGO_COMPAS: 'MINIJUEGO_COMPAS',
    MINIJUEGO_FECHA: 'MINIJUEGO_FECHA',
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
            mensaje = `Es el turno de ${nombreJ}, por favor, ${hayEquipos ? 'decid' : 'di'} 'Tirar dado' para ver el número de casillas a avanzar. `;
            break;
        case EstadoJuego.MOVER_FICHA:
            mensaje = `Es el turno de ${nombreJ}, por favor, ${hayEquipos ? 'decid' : 'di'} 'Mover ficha' para poder avanzar. `;
            break;
        case EstadoJuego.MINIJUEGO_VF:
            mensaje = `${nombreJ}, responda${hayEquipos ? 'n' : ''} con 'verdadero' o 'falso'. Si la respuesta es correcta,  \
                       ${hayEquipos ? 'ganaréis' : 'ganarás'} 10 puntos. La pregunta es: ${pregunta}. `;
            break;
        case EstadoJuego.MINIJUEGO_CIFRAS:
            mensaje = `${nombreJ}, responda${hayEquipos ? 'n' : ''} con el número que pensáis que es correcto. Si  \
                       ${hayEquipos ? 'acertáis, ganaréis' : 'aciertas, ganarás'} 30 puntos. La pregunta es: ${pregunta}. `;
            break;
        case EstadoJuego.MINIJUEGO_FECHA:
            mensaje = `${nombreJ}, responda${hayEquipos ? 'n' : ''} con el día de la semana, mes o estación del año que considere ${hayEquipos ? 'n ' : ' '} \
            adecuada. Si la respuesta es correcta, ${hayEquipos ? 'ganaréis' : 'ganarás'} 20 puntos. La pregunta es: ${pregunta}. `;
            break;
        case EstadoJuego.MINIJUEGO_CASILLA:
            mensaje = `${nombreJ}, responda${hayEquipos ? 'n' : ''} con el nombre de la casilla en la que estaba antes de caer en la actual. Si \
            ${hayEquipos ? ' lográis acordaros ' : ' logras acordarte '} de la casilla anterior, ${hayEquipos ? 'ganaréis' : 'ganarás'} 25 puntos. `;
            break;
        case EstadoJuego.MINIJUEGO_COMPAS:
            mensaje = `${nombreJ}, responda${hayEquipos ? 'n' : ''} con 'sí' o 'no'. Si  el ${hayEquipos ? 'equipo ' : 'participante '} encargado \
            de confirmar la respuesta dice 'sí', entonces ambos ganaréis 15 puntos. La pregunta es: ${pregunta}. `;
            break;
        case EstadoJuego.FINALIZADO:
            mensaje = 'Se ha terminado la partida, gracias por jugar. ';
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
