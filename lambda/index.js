//const handlers = require('./handlers.js');

const Alexa = require('ask-sdk-core');
const bienvenida = require('./apl/bienvenida.json');
const fichas = require('./apl/fichas.json');
const {crearJugadores} = require('./Jugador.js');
const {crearTableroPrueba} = require('./Tablero.js');
const {pasarTurno, avanzaJugador, getJugadoresCasilla} = require('./Oca.js');
const {tirarDado, getUrlDado} = require('./Dado.js');

const WELCOME_TOKEN= 'text';
let jugadores;
let turno = 0;
let dado = 0;
let tablero = crearTableroPrueba();
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
            speakOutput += "Claro, con mucho gusto. Hay dos objetivos principales en este juego. El primero consiste \
                            en ser el jugador más rápido en llegar a la última casilla del tablero, la número 63. \
                            El segundo objetivo, acumular el mayor número de puntos, que se pueden conseguir ganando \
                            los minijuegos de las casillas sorpresa del tablero. En cada turno, el jugador actual tendrá \
                            que tirar el dado y avanzar su ficha por el tablero. Para más información acerca de las \
                            casillas disponibles o los comandos de voz, siéntase libre de preguntarme.";
            
        } else if (tema === 'casillas'){
            speakOutput += "Claro, con mucho gusto. Hay 5 tipos de casillas en este juego. En primer lugar, las \
                            casillas normales, que no desencadenan ningún evento. En segundo lugar, las casillas \
                            de oca en oca, que permiten al jugador avanzar a la siguiente casilla de oca, incluida \
                            la última, y volver a tirar el dado. En tercer lugar,  la casilla de puente a puente, \
                            que mueven al jugador al otro puente del tablero, pero sin darle un turno extra. \
                            En cuarto lugar, las casillas de penalización, que hacen que el jugador pierda \
                            un número determinado de turnos, sin poder avanzar. En último lugar, las casillas \
                            sorpresa, que inician un minijuego aleatorio con la posibilidad de ganar puntos, en el \
                            que dependiendo del que haya tocado, pueden participar más jugadores.";
            
        } else if (tema === 'minijuegos'){
            speakOutput += "Claro, con mucho gusto. Los minijuegos disposibles son: ...";
            
        } else if (tema === 'comandos'){
            speakOutput += "Claro, con mucho gusto. Los comandos de voz disponibles son: nueva partida, \
                            tirar dado, mover ficha, ayuda y terminar partida";
        }
        
        speakOutput += ' Espero que le haya servido de ayuda. No dude en preguntarme de nuevo si no le quedó claro. ';
    
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('¿Quiere que le explique algo más?')
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
            sessionAttributes.numJugadores = njugadores;
            
            jugadores = crearJugadores(njugadores);
            for (let i = 0; i < njugadores; i++){
                penalizaciones[i] = 0;
            }
            
            speakOutput += `${njugadores === 1 ? 'Este es el jugador que va a participar' : 'Estos son los jugadores que van a participar <break time="2s"/>'}`;
            jugadores.forEach(jugador => {
                speakOutput += (`<break time="1s"/> Jugador ${jugador.id + 1}, representado por el color ${jugador.color}. `);
            });
            
            speakOutput += `<break time="3s"/> Bien, si ${njugadores === 1 ? 'el jugador está preparado' : 'los jugadores están preparados'}, que comience la partida. `
            repromptAudio = `Jugador ${jugadores[turno].color}, proceda a tirar el dado`;
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
                                id: (jugador.id+1),
                                codigo: jugador.codigo
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
            speakOutput = `Jugador ${jugadores[turno].color} ha tirado el dado. <break time="10s"/>`
            dado = tirarDado();
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
            
            repromptAudio = `Jugador ${jugadores[turno].color} ha sacado un ${dado}. Por favor proceda a mover su ficha.`;
            speakOutput += repromptAudio;
        } else {
            let njugadores =  sessionAttributes.numJugadores;
            sessionAttributes.valorDado = undefined;
            let jActual = jugadores[turno];
            
            const [casillaNueva, informe, finPartida, dobleTurno] = avanzaJugador(jActual, dado, tablero, jugadores, penalizaciones);
            speakOutput += informe;
            
            const jugEnCasilla = getJugadoresCasilla(jActual.getPosActual(), jActual, jugadores);
            
            if (!finPartida) {
                if (dobleTurno){
                    repromptAudio = `<break time="3s"/> Vuelve a ser el turno del jugador ${jugadores[turno].color}. Por favor tire el dado de nuevo. `;
                    speakOutput += repromptAudio;
                    
                } else {
                    turno = pasarTurno(turno, njugadores);
                    repromptAudio = `<break time="3s"/> Ahora es el turno del jugador ${jugadores[turno].color}. Por favor tire el dado. `;
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
                            circleId: `J${jActual.id}`,
                            casillaImg: casillaNueva.url,
                            fichas: jugEnCasilla.map(jugador => ({
                                codigo: jugador.codigo,
                                id: `J${jugador.id}`
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
        tirarDadoHandler,
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