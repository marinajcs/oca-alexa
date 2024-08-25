const Alexa = require('ask-sdk-core');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const bienvenida = require('./apl/bienvenida.json');
const fichas = require('./apl/fichas.json');
const {JuegoOca} = require('./JuegoOca.js');
const {Jugador} = require('./Jugador.js')
const {tirarDado, getUrlDado} = require('./Dado.js');
const {reglasInfo, casillasInfo, minijuegosInfo, comandosInfo} = require('./exports/frasesAyuda.js');
const {EstadoJuego, informeEstado} = require('./EstadoJuego.js');
const {asumirRol, guardarPartida, cargarPartida} = require('./db.js');

let oca = new JuegoOca();

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        let speakOutput = 'Bienvenidos y bienvenidas al juego de la oca. Si tiene dudas acerca del juego, pídame ayuda.\
                           Para empezar una partida, di "Nueva partida"';
                           
        let responseBuilder = handlerInput.responseBuilder;

        if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
            responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: 'bienvenida',
                document: bienvenida
            });
        } 
         
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Para empezar una partida, di "Nueva partida"')
            .withShouldEndSession(false)
            .getResponse();
    }
};

const configuracion1Handler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'configuracionPruebaIntent';
    },
    handle(handlerInput) {
        const {request} = handlerInput.requestEnvelope.request;
        let responseBuilder = handlerInput.responseBuilder;
        let speakOutput, repromptAudio;
        
        oca = new JuegoOca();
        oca.setEquipos(true);
        const hayEquipos = true;
        oca.setEstado(EstadoJuego.CONFIGURANDO);
        oca.crearJugadores(2);
        oca.getJugador(0).setNombre('los campeones rojos');
        oca.getJugador(1).setNombre('las divinas azules');
        oca.getJugador(0).setPuntos(15);
        oca.getJugador(1).setPuntos(30);
        oca.setEstado(EstadoJuego.TIRAR_DADO);
        
        speakOutput = ` Bien, sin más dilación, que comience la partida. Recuerden que en cada turno primero se debe decir 'tirar dado', y después \
                       'mover ficha', para poder realizar dichas acciones. ${hayEquipos ? 'Equipo' : ''} ${oca.getNombreJActual()}, proceda a tirar el dado`;
        
        repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());
        
        responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: 'jugadoresToken',
                document: fichas,
                datasources: {
                    datosFichas: {
                        type: 'object',
                        properties: {
                            jugadores: oca.getJugadores().map(jugador => ({
                                nombre: jugador.nombre,
                                codigo: jugador.codigo
                            }))
                        }
                    }
                }
        })
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
}

const guardarPartidaHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'guardarPartidaIntent';
    },
    async handle(handlerInput) {
        const {request} = handlerInput.requestEnvelope.request;
        let responseBuilder = handlerInput.responseBuilder;
        let speakOutput, repromptAudio;
        
        const db = await asumirRol();
        const dbTxt = await guardarPartida(db, oca);

        speakOutput = dbTxt;
        repromptAudio = informeEstado(oca.getEstado(), oca.getEquipos(), oca.getNombreJActual());
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
}

const cargarPartidaHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'cargarPartidaIntent';
    },
    async handle(handlerInput) {
        const {request} = handlerInput.requestEnvelope.request;
        let responseBuilder = handlerInput.responseBuilder;
        let speakOutput, repromptAudio;
        oca.setEstado(EstadoJuego.CONFIGURANDO);
        
        const db = await asumirRol();
        const dbTxt = await cargarPartida(db, oca);
        
        speakOutput = dbTxt;
        speakOutput += 'Bien, sin más dilación, continuemos la partida donde la dejamos. ';
        repromptAudio = informeEstado(oca.getEstado(), oca.getEquipos(), oca.getNombreJActual());
        speakOutput += repromptAudio;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
}

const ayudaReglasHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ayudaReglasIntent';
    },
    handle(handlerInput) {
        const {request} = handlerInput.requestEnvelope.request;
        let responseBuilder = handlerInput.responseBuilder;
        let speakOutput = '';

        const temaAyuda = Alexa.getSlotValue(handlerInput.requestEnvelope, 'temaAyuda');
        const tema = handlerInput.requestEnvelope.request.intent.slots.temaAyuda.resolutions.resolutionsPerAuthority[0].values[0].value.name;

        if (tema === 'reglas'){
            speakOutput += reglasInfo;
            
        } else if (tema === 'casillas'){
            speakOutput += casillasInfo;
            
        } else if (tema === 'minijuegos'){
            speakOutput += minijuegosInfo;
            
        } else if (tema === 'comandos'){
            speakOutput += comandosInfo;
        }
        
        speakOutput += ' Espero que le haya servido de ayuda. No dude en preguntarme de nuevo si no le quedó claro. ';
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Quiere que le explique algo más? Los temas que puedo explicarle son: las reglas, las casillas, los minijuegos y los comandos de voz.')
            .withShouldEndSession(false)
            .getResponse();
    }
};

const nuevaPartidaHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'nuevaPartidaIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        let responseBuilder = handlerInput.responseBuilder;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let speakOutput, repromptAudio, registroActual;
        let njugadores, hayEquipos;
        oca.setEstado(EstadoJuego.CONFIGURANDO);

        if (intent.confirmationStatus === 'CONFIRMED'){
            njugadores = Alexa.getSlotValue(requestEnvelope, 'numJugadores');
            const tparticipante = Alexa.getSlotValue(requestEnvelope, 'tipoParticipante');
            if (tparticipante === 'equipos') {
                oca.setEquipos(true);
                hayEquipos = true;
            }
            
            oca.crearJugadores(njugadores);
            sessionAttributes.numJugadoresSet = 0;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            oca.setEstado(EstadoJuego.REGISTRO_NOMBRES);
            
            registroActual = `Empezamos por el nombre del ${hayEquipos ? 'equipo' : 'participante con color'} ${oca.getJugador(0).getColor()}.`

            speakOutput = `Para registrar el nombre del ${hayEquipos ? 'equipo' : 'participante'}, cada uno debe decir: \
                           '${hayEquipos ? 'Nuestro' : 'Mi'} nombre es', seguido del nombre elegido. Por ejemplo, \
                           '${hayEquipos ? 'Nuestro' : 'Mi'} nombre es '${hayEquipos ? 'Amantes de la paella' : 'Roberta'}. ` + registroActual;
                           
            repromptAudio = informeEstado(oca.getEstado(), hayEquipos) + registroActual;
            
        }
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const addJugadorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'addJugadorIntent';
    },
    async handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        let responseBuilder = handlerInput.responseBuilder;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let speakOutput, repromptAudio, registroActual;
        let nombreJugador = Alexa.getSlotValue(requestEnvelope, 'nombreJugador');
        let nJugadoresSet = sessionAttributes.numJugadoresSet;
        const njugadores = oca.getNumJugadores();
        const hayEquipos = oca.getEquipos();

        oca.getJugador(nJugadoresSet).setNombre(nombreJugador);
        nJugadoresSet++;
        sessionAttributes.numJugadoresSet = nJugadoresSet;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        if (nJugadoresSet < njugadores) {
            registroActual = `<break time="2s"/> Ahora, dime el nombre del ${hayEquipos ? 'equipo' : 'participante con color'} ${oca.getJugador(nJugadoresSet).getColor()}. `
            speakOutput = `Se ha registrado el nombre ${nombreJugador}. ` + registroActual;
            repromptAudio = informeEstado(oca.getEstado(), hayEquipos) + registroActual;
        } else {
            speakOutput = `Se ha registrado el nombre ${nombreJugador}. Todos los participantes han sido añadidos. <break time="2s"/>`;
                
            speakOutput += `${njugadores === 1 ? `Este es el ${hayEquipos ? 'equipo' : 'jugador'} que va a participar` : `Estos son los ${hayEquipos ? 'equipos' : 'jugadores'} que van a participar <break time="2s"/>`}. `;
            oca.getJugadores().forEach(jugador => {
                speakOutput += (`<break time="1s"/> ${hayEquipos ? 'Equipo' : 'Participante'} ${jugador.getNombre()}, cuyo color asignado es el ${jugador.getColor()}. `);
            });
            oca.setEstado(EstadoJuego.TIRAR_DADO);
            
            const db = await asumirRol();
            await guardarPartida(db, oca);
            
            speakOutput += `<break time="3s"/> Bien, sin más dilación, que comience la partida. Recuerden que en cada turno: primero, se dice 'tirar dado' y después, \
                            'mover ficha' para poder realizar dichas acciones. ${hayEquipos ? 'Equipo' : ''} ${oca.getNombreJActual()}, proceda a tirar el dado`;
            
            repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());
            
            responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: 'jugadoresToken',
                document: fichas,
                datasources: {
                    datosFichas: {
                        type: 'object',
                        properties: {
                            jugadores: oca.getJugadores().map(jugador => ({
                                nombre: jugador.nombre,
                                codigo: jugador.codigo
                            }))
                        }
                    }
                }
            })
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const jugarTurnoHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'jugarTurnoIntent';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        let speakOutput, repromptAudio;
        let responseBuilder = handlerInput.responseBuilder;
        let dado = sessionAttributes.valorDado;
        let jActual = oca.getJugadorActual();
        const hayEquipos = oca.getEquipos();
        
        if (dado === undefined && oca.getPenalizaciones(jActual.getId()) === 0){
            speakOutput = `${hayEquipos ? 'El equipo' : ''} ${oca.getNombreJActual()} ha tirado el dado. <break time="10s"/>`
            //dado = tirarDado();
            dado = 1;
            sessionAttributes.valorDado = dado;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

            if (Alexa.getSupportedInterfaces(handlerInput.requestEnvelope)['Alexa.Presentation.APL']){
                responseBuilder.addDirective({
                    type: 'Alexa.Presentation.APL.RenderDocument',
                    token: 'tiradaDado',
                    document: require('./apl/dado.json'),
                    datasources: {
                        datosDado: {
                            type: 'object',
                            properties: {
                                num: getUrlDado(dado)
                            }
                        }
                    }
                });
            }
            oca.setEstado(EstadoJuego.MOVER_FICHA);
            
            speakOutput += ` ${oca.getNombreJActual()} ha${hayEquipos ? 'n' : ''} sacado un ${dado}.`;
            if (oca.getRonda() < 4) {
                speakOutput += ` Para poder mover su ficha, diga: 'Mover ficha'. `;
            } else {
                speakOutput += ` Por favor proceda${hayEquipos ? 'n' : ''} a mover su ficha. `;
            }
            repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());
            
        } else {
            sessionAttributes.valorDado = undefined;
            
            const [casillaNueva, informe] = oca.avanzaJugador(jActual, dado);
            const jugEnCasilla = oca.getJugadoresCasilla(jActual.getPosActual(), jActual);
            speakOutput = informe;
            
            if (jugEnCasilla.length === 1) {
                const nombreJugador = jugEnCasilla[0].nombre;
                speakOutput += ` ¡Qué casualidad! En esta casilla también ${hayEquipos ? ' están ' : ' está '} ${nombreJugador}. `;
            } else if (jugEnCasilla.length > 1) {
                const nombresJugadores = jugEnCasilla.map(jugador => jugador.nombre).join(', ');
                speakOutput += ` ¡Qué casualidad! En esta casilla también están los siguientes ${hayEquipos ? ' equipos' : ' jugadores' }: ${nombresJugadores}. `;
            }
            speakOutput += casillaNueva.recibeJugador(jActual, hayEquipos);

            if (oca.getEstado() !== EstadoJuego.FINALIZADO) {
                if (oca.getEstado() === EstadoJuego.TIRAR_DADO){
                    speakOutput += `<break time="3s"/> Vuelve a ser el turno de ${jActual.getNombre()}. Por favor ${hayEquipos ? 'tiren' : 'tire'} el dado de nuevo. `;
                    repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jActual.getNombre());
                
                } else if (oca.getEstado() === EstadoJuego.MINIJUEGO_VF) {
                    const pregunta = casillaNueva.getPreguntaRandom();
                    sessionAttributes.preguntaActual = pregunta;
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                    const preguntaTxt = 'La pregunta es: ' + pregunta.question + ' ¿Verdadero o falso?';
                    speakOutput += preguntaTxt;
                    repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jActual.getNombre(), preguntaTxt);
                    
                } else if (oca.getEstado() === EstadoJuego.MINIJUEGO_CIFRAS) {
                    const pregunta = casillaNueva.getPreguntaRandom();
                    sessionAttributes.preguntaActual = pregunta;
                    sessionAttributes.reboteFechas = oca.getTurno();
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                    const preguntaTxt = 'La pregunta es: ' + pregunta.question;
                    speakOutput += preguntaTxt;
                    repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jActual.getNombre(), preguntaTxt);
                 
                } else if (oca.getEstado() === EstadoJuego.MINIJUEGO_COMPAS) {
                    let [pregunta, sujetoPregunta] = casillaNueva.getPreguntaRandom(oca.getCompas(jActual));
                    sessionAttributes.preguntaActual = pregunta;
                    sessionAttributes.sujetoResponde = false;
                    sessionAttributes.sujetoPregunta = sujetoPregunta.getId();
                    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                    const preguntaTxt = `<break time="2s"/> La pregunta es acerca de ${sujetoPregunta.getNombre()}. ${hayEquipos ? pregunta.questionE : pregunta.questionJ} \
                                         <break time="1s"/> ${jActual.getNombre()}, ¿es esto correcto o incorrecto? `;
                    speakOutput += preguntaTxt;
                    repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jActual.getNombre(), preguntaTxt);
                    
                } else if (oca.getEstado() === EstadoJuego.MINIJUEGO_FECHAS) {
                    const pregunta = casillaNueva.getPreguntaRandom();
                    const preguntaTxt = 'La pregunta es: ' + pregunta.question;
                    sessionAttributes.preguntaActual = pregunta;
                    sessionAttributes.solucionFecha = casillaNueva.getSolucion(pregunta);
                    speakOutput += preguntaTxt;
                    repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jActual.getNombre(), preguntaTxt);
                    
                } else if (oca.getEstado() === EstadoJuego.MINIJUEGO_CASILLA) {
                    oca.setEstado(EstadoJuego.MINIJUEGO_CASILLA);
                    repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jActual.getNombre());
                    
                } else {
                    speakOutput += oca.pasarTurno();
                    repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());
                }
                
            } else {
                speakOutput += `<break time="3s"/> ${oca.anunciarGanadores()}`;
                //responseBuilder.endSession(); overwritten by False
            }
            responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: 'casillaApl',
                document: require('./apl/casilla.json'),
                datasources: {
                    datosCasilla: {
                        type: 'object',
                        properties: {
                            topText: casillaNueva.id,
                            circleColor: jActual.codigo,
                            circleId: jActual.nombre,
                            casillaImg: casillaNueva.url,
                            fichas: jugEnCasilla.map(jugador => ({
                                codigo: jugador.codigo,
                                id: jugador.nombre
                            }))
                        }
                    }
                }
            })
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const preguntasVyFHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'preguntasVyFIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        let speakOutput, repromptAudio;
        const respuesta = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuestaVF');
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const pregunta = sessionAttributes.preguntaActual;
        const solucion = pregunta.answer;
        let jActual = oca.getJugadorActual();
        const hayEquipos = oca.getEquipos();
        
        if ((respuesta === 'verdadero' && solucion) || (respuesta === 'falso' && !solucion)) {
            jActual.addPuntos(10);
            speakOutput = ` ¡Correcto! ${pregunta.explanation} ${hayEquipos ? 'Habéis' : 'Has'} ganado 20 puntos. \
                            ${hayEquipos ? 'Vuestra' : 'Tu'} puntuación es ahora ${jActual.getPuntos()}. `;
        } else {
            speakOutput = ` Lástima, es incorrecto. ${pregunta.explanation} `;
        }
        
        speakOutput += oca.pasarTurno();
        repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const preguntasCifrasHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'preguntasCifrasIntent';
    },
    handle(handlerInput) {
        let speakOutput, repromptAudio;
        const respuesta = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuestaCifra');
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const pregunta = sessionAttributes.preguntaActual;
        const hayEquipos = oca.getEquipos();
        let rebote = sessionAttributes.reboteFechas;

        if (respuesta === pregunta.answer) {
            oca.getJugador(rebote).addPuntos(50);
            speakOutput = ` ¡Correcto! ${hayEquipos ? 'Habéis' : 'Has'} ganado 50 puntos. \
                            ${hayEquipos ? 'Vuestra' : 'Tu'} puntuación es ahora ${oca.getJugador(rebote).getPuntos()}. `;
            
            speakOutput += oca.pasarTurno();
            repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());
            
        } else {
            speakOutput = ' Lástima, es incorrecto. ';
            rebote = oca.calcularRebote(rebote);
            if (rebote !== oca.getTurno()) {
                speakOutput += `La pregunta rebota a ${oca.getJugador(rebote).getNombre()}: ${pregunta.question} `;
                repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getJugador(rebote).getNombre(), pregunta.question);
            } else {
                speakOutput = `Parece que nadie ha acertado la pregunta. La respuesta correcta era: ${pregunta.answer}. `;
            
                speakOutput += oca.pasarTurno();
                repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());
            }
            sessionAttributes.reboteFechas = rebote;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        }

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const preguntasCasillaHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'preguntasCasillaIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        let speakOutput, repromptAudio;
        let jActual = oca.getJugadorActual();
        const solucion = jActual.getUltimaCasilla();
        const hayEquipos = oca.getEquipos();
        const respuestaCasilla = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuestaCasilla');
        
        if (!respuestaCasilla) {
            speakOutput = ` No pasa nada, para la próxima será. La respuesta correcta era: la casilla ${solucion}. `;
   
        } else {
            const respuestaValidada = handlerInput.requestEnvelope.request.intent.slots.respuestaCasilla.resolutions.resolutionsPerAuthority[0].values[0].value.name;
            
            if (respuestaValidada === solucion) {
                jActual.addPuntos(25);
                speakOutput = ` ¡Correcto! ${hayEquipos ? 'Habéis' : 'Has'} ganado 25 puntos. \
                                ${hayEquipos ? 'Vuestra' : 'Tu'} puntuación es ahora ${jActual.getPuntos()}. `;
            } else {
                speakOutput = ` Lástima, es incorrecto. La respuesta era: la casilla ${solucion}. `;
            }
        }
        
        speakOutput += oca.pasarTurno();
        repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
};


const preguntasCompasHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'preguntasCompasIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        let speakOutput, repromptAudio;
        const respuesta = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuestaCompas');
        const respuestaValidada  = intent.slots.respuestaCompas.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const pregunta = sessionAttributes.preguntaActual;
        const sujetoPregunta = sessionAttributes.sujetoPregunta;
        let sujetoResponde = sessionAttributes.sujetoResponde;
        const hayEquipos = oca.getEquipos();
        let jActual = oca.getJugadorActual();
        let jPregunta = oca.getJugador(sujetoPregunta);

        if (!sujetoResponde) {
            speakOutput = `${jActual.getNombre()} ha${hayEquipos ? 'n' : ''} contestado que es ${respuesta}. Me pregunto si ha${hayEquipos ? 'n' : ''} acertado... \
                           ${jPregunta.getNombre()}, ¿es esta repuesta correcta o incorrecta?`;
            sessionAttributes.sujetoResponde = true;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            const recordatorio = `A la pregunta acerca de ${hayEquipos ? ' vosotros' : ' ti'}: ${hayEquipos ? pregunta.questionE : pregunta.questionJ} ${jActual.getNombre()} \
                                  dijeron que era '${respuesta}'. ¿Es su repuesta correcta o incorrecta? `
            repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jPregunta.getNombre(), recordatorio);
            
        } else {
            if (respuestaValidada === 'correcto') {
                jActual.addPuntos(15);
                jPregunta.addPuntos(10);
                speakOutput = `¡Buen trabajo! Por conoceros bien, ${jActual.getNombre()} se lleva${hayEquipos ? 'n' : ''} \
                                15 puntos y ${jPregunta.getNombre()}, 10 puntos.  \
                                Ahora vuestras puntuaciones son ${jActual.getPuntos()} y ${jPregunta.getPuntos()} respectivamente. `;
            } else {
                speakOutput = 'Lástima, pero no os desaniméis, ya habrá otra oportunidad de conseguir puntos. ';
            }
            
            speakOutput += oca.pasarTurno();
            repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const preguntasFechasHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'preguntasFechasIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        let speakOutput, repromptAudio;
        let respuesta;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const pregunta = sessionAttributes.preguntaActual;
        const solucion = sessionAttributes.solucionFecha;
        let jActual = oca.getJugadorActual();
        const hayEquipos = oca.getEquipos();
        
        switch(pregunta.type) {
            case 'diaSemana':
                respuesta = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuestaDiaSemana');
                break;
            case 'mes':
                respuesta = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuestaMes');
                break;
            case 'estacion':
                respuesta = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuestaEstacion');
                break;
        }
        
        if (respuesta === solucion) {
            jActual.addPuntos(20);
            speakOutput = ` ¡Correcto! ${hayEquipos ? 'Habéis' : 'Has'} ganado 20 puntos. \
                            ${hayEquipos ? 'Vuestra' : 'Tu'} puntuación es ahora ${jActual.getPuntos()}. `;
        } else {
            speakOutput = ` Lástima, es incorrecto. La respuesta correcta era: ${solucion}. `;
        }
        
        speakOutput += oca.pasarTurno();
        repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Por supuesto. Los temas que puedo explicarle son: las reglas del juego, las casillas del tablero, \
                             los tipos de minijuegos y los comandos de voz disponibles.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'No te he entendido. Repite por favor';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        let speakOutput;
        
        if (oca.getEstado() === EstadoJuego.MINIJUEGO_COMPAS || oca.getEstado() === EstadoJuego.MINIJUEGO_VF || 
            oca.getEstado() === EstadoJuego.MINIJUEGO_CIFRAS || oca.getEstado() === EstadoJuego.MINIJUEGO_FECHAS) {
                
            const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            const pregunta = sessionAttributes.preguntaActual;
            speakOutput = 'Comando no válido. ' + informeEstado(oca.getEstado(), oca.getEquipos(), oca.getNombreJActual(), pregunta.question);
            
        } else {
            speakOutput = 'Comando no válido. ' + informeEstado(oca.getEstado(), oca.getEquipos(), oca.getNombreJActual());
        }

        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withShouldEndSession(false)
            .getResponse();
    }
};

module.exports = {
    LaunchRequestHandler,
    configuracion1Handler,
    guardarPartidaHandler,
    cargarPartidaHandler,
    ayudaReglasHandler,
    nuevaPartidaHandler,
    addJugadorHandler,
    jugarTurnoHandler,
    preguntasVyFHandler,
    preguntasCifrasHandler,
    preguntasCasillaHandler,
    preguntasCompasHandler,
    preguntasFechasHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
    ErrorHandler
};