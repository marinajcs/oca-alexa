//const handlers = require('./handlers.js');

const Alexa = require('ask-sdk-core');
const bienvenida = require('./apl/bienvenida.json');
const fichas = require('./apl/fichas.json');
const {crearJugadores, Jugador} = require('./Jugador.js');
const {crearTableroPrueba, crearTablero} = require('./Tablero.js');
const {pasarTurno, avanzaJugador, getJugadoresCasilla} = require('./Oca.js');
const {tirarDado, getUrlDado} = require('./Dado.js');
const {reglasInfo, casillasInfo, minijuegosInfo, comandosInfo} = require('./exports/frasesAyuda.js');

const WELCOME_TOKEN= 'text';
let hayEquipos = false; 
let jugadores;
let nj = 0;
let turno = 0;
let dado = 0;
let tablero = crearTablero();
let penalizaciones = [];

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
                token: WELCOME_TOKEN,
                document: bienvenida
            });
        } 
         
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.numJugadores = 2;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        const njugadores = sessionAttributes.numJugadores;
        hayEquipos = true;
        jugadores = crearJugadores(njugadores);
        for (let i = 0; i < njugadores; i++){
            penalizaciones[i] = 0;
        }
        jugadores[0].nombre = 'los reyes del mambo';
        jugadores[1].nombre = 'las divinas';
         
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('Para empezar una partida, di "Nueva partida"')
            .withShouldEndSession(false)
            .getResponse();
    }
};


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
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const {requestEnvelope} = handlerInput;
        const {intent} = requestEnvelope.request;
        let responseBuilder = handlerInput.responseBuilder;
        let speakOutput = '';
        let repromptAudio;
        let njugadores = 0;

        if (intent.confirmationStatus === 'CONFIRMED'){
            njugadores = Alexa.getSlotValue(requestEnvelope, 'numJugadores');
            let tparticipante = Alexa.getSlotValue(requestEnvelope, 'tipoParticipante');
            if (tparticipante === 'equipos') 
                hayEquipos = true;
            
            sessionAttributes.numJugadores = njugadores;
            sessionAttributes.porEquipos = hayEquipos;
            
            jugadores = crearJugadores(njugadores);
            for (let i = 0; i < njugadores; i++){
                penalizaciones[i] = 0;
            }
            
            speakOutput = `Para registrar el nombre del ${hayEquipos ? 'equipo' : 'participante'}, cada uno debe decir: \
                           '${hayEquipos ? 'Nuestro' : 'Mi'} nombre es', seguido del nombre elegido. Por ejemplo, \
                           '${hayEquipos ? 'Nuestro' : 'Mi'} nombre es '${hayEquipos ? 'Amantes de la paella' : 'Roberta'}. \
                           Empezamos por el nombre del ${hayEquipos ? 'equipo' : 'participante con color'} ${jugadores[0].color}.`
            
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
        let speakOutput = '';
        let repromptAudio = '';
        let nombreJugador = Alexa.getSlotValue(requestEnvelope, 'nombreJugador');
        const njugadores = jugadores.length;

        jugadores[nj].nombre = nombreJugador;
        nj++;

        if (nj < njugadores) {
            speakOutput = `Se ha registrado el nombre ${nombreJugador}. <break time="2s"/> Ahora, dime el nombre del ${hayEquipos ? 'equipo' : 'participante con color'} ${jugadores[nj].color}.`;
            repromptAudio = speakOutput;
        } else {
            speakOutput = `Se ha registrado el nombre ${nombreJugador}. Todos los participantes han sido añadidos. <break time="2s"/>`;
                
          
            speakOutput += `${njugadores === 1 ? `Este es el ${hayEquipos ? 'equipo' : 'jugador'} que va a participar` : `Estos son los ${hayEquipos ? 'equipos' : 'jugadores'} que van a participar <break time="2s"/>`}. `;
            jugadores.forEach(jugador => {
                speakOutput += (`<break time="1s"/> ${hayEquipos ? 'Equipo' : 'Participante'} ${jugador.nombre}, cuyo color asignado es el ${jugador.color}. `);
            });
            
            
            speakOutput += `<break time="3s"/> Bien, sin más dilación, que comience la partida. Recuerden que en cada turno primero se debe decir 'tirar dado' \
                            y después, 'mover ficha' para poder realizar dichas acciones. `
            repromptAudio = `${hayEquipos ? 'Equipo' : ''} ${jugadores[turno].nombre}, proceda a tirar el dado`;
            speakOutput += repromptAudio;
            
        
            responseBuilder.addDirective({
                type: 'Alexa.Presentation.APL.RenderDocument',
                token: 'jugadoresToken',
                document: fichas,
                datasources: {
                    datosFichas: {
                        type: 'object',
                        properties: {
                            jugadores: jugadores.map(jugador => ({
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
        let speakOutput = '';
        let repromptAudio;
        let responseBuilder = handlerInput.responseBuilder;
        dado = sessionAttributes.valorDado;
        
        if (dado === undefined && penalizaciones[jugadores[turno].id] === 0){
            speakOutput = `${hayEquipos ? 'El equipo' : ''} ${jugadores[turno].nombre} ha tirado el dado. <break time="10s"/>`
            dado = tirarDado();
            //dado = 2;
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
            
            repromptAudio = ` ${jugadores[turno].nombre} ha${hayEquipos ? 'n' : ''} sacado un ${dado}. Por favor proceda${hayEquipos ? 'n' : ''} a mover su ficha.`;
            speakOutput += repromptAudio;
        } else {
            let njugadores =  sessionAttributes.numJugadores;
            sessionAttributes.valorDado = undefined;
            let jActual = jugadores[turno];
            
            const [casillaNueva, informe, finPartida, dobleTurno, minijuego] = avanzaJugador(jActual, dado, tablero, jugadores, penalizaciones, hayEquipos);
            speakOutput += informe;
            
            const jugEnCasilla = getJugadoresCasilla(jActual.getPosActual(), jActual, jugadores);
            
            if (!finPartida) {
                if (dobleTurno){
                    repromptAudio = `<break time="3s"/> Vuelve a ser el turno de ${jActual.nombre}. Por favor ${hayEquipos ? 'tiren' : 'tire'} el dado de nuevo. `;
                    speakOutput += repromptAudio;
                
                } else if (minijuego !== 0) {
                    let pregunta = casillaNueva.getPreguntaRandom();

                    if (minijuego === 1) {
                        sessionAttributes.preguntaActual = pregunta;
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                        speakOutput += 'La pregunta es: ' + pregunta.question + ' ¿Verdadero o falso?';
                        repromptAudio = 'La pregunta para ' + jActual.nombre + ' es: ' + pregunta.question;
                        
                    } else if(minijuego === 2) {
                        sessionAttributes.preguntaActual = pregunta;
                        sessionAttributes.reboteFechas = turno;
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                        speakOutput += 'La pregunta es: ' + pregunta.question;
                        repromptAudio = 'La pregunta para ' + jActual.nombre + ' es: ' + pregunta.question;
                     
                    } else if (minijuego === 3) {
                        /*
                        sessionAttributes.sujetoRespuesta = false;
                        sessionAttributes.sujetoPregunta = casillaNueva.getCompaRandom();
                        speakOutput += 'La pregunta es: alguien del equipo...' + pregunta.question + ' ¿Sí o no?';
                        repromptAudio = 'La pregunta para ' + jActual.nombre + ' es: ' + pregunta.question;
                        */
                    }

                } else {
                    turno = pasarTurno(turno, njugadores);
                    repromptAudio = `<break time="3s"/> Ahora es el turno de ${jugadores[turno].nombre}. Por favor, ${hayEquipos ? 'tiren' : 'tire'} el dado. `;
                    speakOutput += repromptAudio;
                }
                
            } else {
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
        const njugadores =  sessionAttributes.numJugadores
        const solucion = pregunta.answer;
        let jActual = jugadores[turno];
        
        if ((respuesta === 'verdadero' && solucion) || (respuesta === 'falso' && !solucion)) {
            jActual.puntos += 10;
            speakOutput = ` ¡Correcto! ${pregunta.explanation} ${hayEquipos ? 'Habéis' : 'Has'} ganado 20 puntos. \
                            ${hayEquipos ? 'Vuestra' : 'Tu'} puntuación es ahora ${jActual.puntos}. `;
        } else {
            speakOutput = ` Lástima, es incorrecto. ${pregunta.explanation} `;
        }
        
        turno = pasarTurno(turno, njugadores);
        repromptAudio = `<break time="3s"/> Ahora es el turno de ${jugadores[turno].nombre}. Por favor, ${hayEquipos ? 'tiren' : 'tire'} el dado. `;
        speakOutput += repromptAudio;

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
        const respuesta = Alexa.getSlotValue(handlerInput.requestEnvelope, 'respuestaFecha');
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const pregunta = sessionAttributes.preguntaActual;
        const njugadores =  sessionAttributes.numJugadores;
        let rebote = sessionAttributes.reboteFechas;

        if (respuesta === pregunta.answer) {
            jugadores[rebote].puntos += 50;
            speakOutput = ` ¡Correcto! ${hayEquipos ? 'Habéis' : 'Has'} ganado 50 puntos. \
                            ${hayEquipos ? 'Vuestra' : 'Tu'} puntuación es ahora ${jugadores[rebote].puntos}. `;
            
            turno = pasarTurno(turno, njugadores);
            repromptAudio = `<break time="3s"/> Ahora es el turno de ${jugadores[turno].nombre}. Por favor, ${hayEquipos ? 'tiren' : 'tire'} el dado. `;
            speakOutput += repromptAudio;
            
        } else {
            speakOutput = ' Lástima, es incorrecto. ';
            rebote = pasarTurno(rebote, njugadores);
            if (rebote !== turno) {
                repromptAudio = `La pregunta rebota a ${jugadores[rebote].nombre}: ${pregunta.question} `;
                speakOutput += repromptAudio;
            } else {
                speakOutput = `Parece que nadie ha acertado la pregunta. La respuesta correcta era: ${pregunta.answer}. `;
            
                turno = pasarTurno(turno, njugadores);
                repromptAudio = `<break time="3s"/> Ahora es el turno de ${jugadores[turno].nombre}. Por favor, ${hayEquipos ? 'tiren' : 'tire'} el dado. `;
                speakOutput += repromptAudio;
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

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        ayudaReglasHandler,
        numJugadoresHandler,
        addJugadorHandler,
        tirarDadoHandler,
        preguntasVyFHandler,
        preguntasFechasHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        handlers.LaunchRequestHandler,
        handlers.HelpIntentHandler,
        handlers.numJugadoresHandler,
        handlers.tirarDadoHandler,
        //handlers.moverJugadorHandler,
        handlers.CancelAndStopIntentHandler,
        handlers.FallbackIntentHandler,
        handlers.SessionEndedRequestHandler,
        handlers.IntentReflectorHandler)
    .addErrorHandlers(
        handlers.ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
    **/