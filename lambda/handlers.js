const Alexa = require('ask-sdk-core');
const bienvenida = require('./apl/bienvenida.json');
const fichas = require('./apl/fichas.json');
const {JuegoOca} = require('./JuegoOca.js');
const {Jugador} = require('./Jugador.js')
const {tirarDado, getUrlDado} = require('./Dado.js');
const {reglasInfo, casillasInfo, minijuegosInfo, comandosInfo} = require('./exports/frasesAyuda.js');
const {EstadoJuego, informeEstado} = require('./EstadoJuego.js');

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
        
        oca.setEquipos(true);
        const hayEquipos = true;
        oca.setEstado(EstadoJuego.CONFIGURANDO);
        oca.crearJugadores(2);
        oca.getJugador(0).setNombre('los campeones rojos');
        oca.getJugador(1).setNombre('las divinas azules');
        oca.setEstado(EstadoJuego.TIRAR_DADO);
        
        speakOutput = `Bien, sin más dilación, que comience la partida. Recuerden que en cada turno primero se debe decir 'tirar dado' y después, \
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

const numJugadoresHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'numJugadoresIntent';
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
    handle(handlerInput) {
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
            registroActual = `<break time="2s"/> Ahora, dime el nombre del ${hayEquipos ? 'equipo' : 'participante con color'} ${oca.getJugador(nJugadoresSet).getColor()} `.
            speakOutput = `Se ha registrado el nombre ${nombreJugador}. ` + registroActual;
            repromptAudio = informeEstado(oca.getEstado(), hayEquipos) + registroActual;
        } else {
            speakOutput = `Se ha registrado el nombre ${nombreJugador}. Todos los participantes han sido añadidos. <break time="2s"/>`;
                
            speakOutput += `${njugadores === 1 ? `Este es el ${hayEquipos ? 'equipo' : 'jugador'} que va a participar` : `Estos son los ${hayEquipos ? 'equipos' : 'jugadores'} que van a participar <break time="2s"/>`}. `;
            oca.getJugadores().forEach(jugador => {
                speakOutput += (`<break time="1s"/> ${hayEquipos ? 'Equipo' : 'Participante'} ${jugador.getNombre()}, cuyo color asignado es el ${jugador.getColor()}. `);
            });
            oca.setEstado(EstadoJuego.TIRAR_DADO);
            
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

const tirarDadoHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'tirarDadoIntent';
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
            dado = 2;
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
            
            const [casillaNueva, informe, finPartida, dobleTurno, minijuego] = oca.avanzaJugador(jActual, dado);
            speakOutput = informe;
            
            const [jugEnCasilla, mensaje] = oca.getJugadoresCasilla(jActual.getPosActual(), jActual);
            speakOutput += mensaje;
            
            if (!finPartida) {
                if (dobleTurno){
                    oca.setEstado(EstadoJuego.TIRAR_DADO);
                    speakOutput += `<break time="3s"/> Vuelve a ser el turno de ${jActual.getNombre()}. Por favor ${hayEquipos ? 'tiren' : 'tire'} el dado de nuevo. `;
                    repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jActual.getNombre());
                
                } else if (minijuego !== 0) {
                    let pregunta = casillaNueva.getPreguntaRandom();
                    let preguntaTxt;
                    
                    if (minijuego === 1) {
                        oca.setEstado(EstadoJuego.MINIJUEGO_VF);
                        sessionAttributes.preguntaActual = pregunta;
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                        preguntaTxt = 'La pregunta es: ' + pregunta.question + ' ¿Verdadero o falso?';
                        speakOutput += preguntaTxt;
                        repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jActual.getNombre(), preguntaTxt);
                        
                    } else if(minijuego === 2) {
                        oca.setEstado(EstadoJuego.MINIJUEGO_CIFRAS);
                        sessionAttributes.preguntaActual = pregunta;
                        sessionAttributes.reboteFechas = oca.getTurno();
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                        preguntaTxt = 'La pregunta es: ' + pregunta.question;
                        speakOutput += preguntaTxt;
                        repromptAudio = informeEstado(oca.getEstado(), hayEquipos, jActual.getNombre(), preguntaTxt);
                     
                    } else if (minijuego === 3) {
                        oca.setEstado(EstadoJuego.MINIJUEGO_COMPAS);
                        /*
                        sessionAttributes.sujetoRespuesta = false;
                        sessionAttributes.sujetoPregunta = casillaNueva.getCompaRandom();
                        speakOutput += 'La pregunta es: alguien del equipo...' + pregunta.question + ' ¿Sí o no?';
                        repromptAudio = 'La pregunta para ' + jActual.nombre + ' es: ' + pregunta.question;
                        */
                    } else if (minijuego === 4) {
                        oca.setEstado(EstadoJuego.MINIJUEGO_FECHA);
                        
                    } else {
                        oca.setEstado(EstadoJuego.MINIJUEGO_CASILLA);
                        
                    }

                } else {
                    oca.pasarTurno();
                    oca.setEstado(EstadoJuego.TIRAR_DADO);
                    speakOutput += oca.anunciarTurno();
                    repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());
                }
                
            } else {
                oca.setEstado(EstadoJuego.FINALIZADO);
                speakOutput += 'Partida terminada. Gracias por jugar.';
                //responseBuilder.endSession();
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
        const njugadores =  oca.getNumJugadores();
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
        
        oca.pasarTurno();
        oca.setEstado(EstadoJuego.TIRAR_DADO);
        speakOutput += oca.anunciarTurno();
        repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());

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
        let speakOutput, repromptAudio;
        const respuesta = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuestaFecha');
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const pregunta = sessionAttributes.preguntaActual;
        const hayEquipos = oca.getEquipos();
        let rebote = sessionAttributes.reboteFechas;

        if (respuesta === pregunta.answer) {
            oca.getJugador(rebote).addPuntos(50);
            speakOutput = ` ¡Correcto! ${hayEquipos ? 'Habéis' : 'Has'} ganado 50 puntos. \
                            ${hayEquipos ? 'Vuestra' : 'Tu'} puntuación es ahora ${oca.getJugador(rebote).getPuntos()}. `;
            
            oca.pasarTurno();
            oca.setEstado(EstadoJuego.TIRAR_DADO);
            speakOutput += oca.anunciarTurno();
            repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getNombreJActual());
            
        } else {
            speakOutput = ' Lástima, es incorrecto. ';
            rebote = oca.calcularRebote(rebote);
            if (rebote !== oca.getTurno()) {
                speakOutput += `La pregunta rebota a ${oca.getJugador(rebote).getNombre()}: ${pregunta.question} `;
                repromptAudio = informeEstado(oca.getEstado(), hayEquipos, oca.getJugador(rebote).getNombre(), pregunta.question);
            } else {
                speakOutput = `Parece que nadie ha acertado la pregunta. La respuesta correcta era: ${pregunta.answer}. `;
            
                oca.pasarTurno();
                oca.setEstado(EstadoJuego.TIRAR_DADO);
                speakOutput += oca.anunciarTurno();
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
/*
const preguntasCompasHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'preguntasCompasIntent';
    },
    handle(handlerInput) {
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        let speakOutput, repromptAudio;
        const respuesta = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuesta');
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const sujetoPregunta = sessionAttributes.sujetoPregunta;
        const sujetoRespuesta = sessionAttributes.sujetoRespuesta;
        const njugadores =  sessionAttributes.numJugadores
        let jActual = jugadores[turno];
        
        if (!sujetoRespuesta) {
            speakOutput = `${jActual.nombre} ha contestado: ` + respuesta + `. ¿Es esto correcto, ${sujetoPregunta.nombre}?`;
            sessionAttributes.sujetoRespuesta = true;
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
        } else {
            if (respuesta === 'sí') {
                jActual.puntos += 15;
                sujetoPregunta.puntos += 5;
                speakOutput = `¡Buen trabajo! Por conoceros bien, ${jActual.nombre} se lleva${hayEquipos ? 'n' : ''} \
                                15 puntos y ${sujetoPregunta.nombre}, 5 puntos.  \
                                Ahora vuestras puntuaciones son ${jActual.puntos} y ${sujetoPregunta.puntos} respectivamente.`;
            } else {
                speakOutput = 'Lástima, pero no os desaniméis, ya habrá otra oportunidad de conseguir puntos.';
            }
            turno = pasarTurno(turno, njugadores);
            repromptAudio = `<break time="3s"/> Ahora es el turno de ${jActual.nombre}. Por favor, ${hayEquipos ? 'tiren' : 'tire'} el dado. `;
            speakOutput += repromptAudio;
        }
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(repromptAudio)
            .withShouldEndSession(false)
            .getResponse();
    }
};
*/
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
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
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
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
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
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
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
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

module.exports = {
    LaunchRequestHandler,
    configuracion1Handler,
    ayudaReglasHandler,
    numJugadoresHandler,
    addJugadorHandler,
    tirarDadoHandler,
    preguntasVyFHandler,
    preguntasFechasHandler,
    //preguntasCompasHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
    ErrorHandler
};