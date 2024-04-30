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
        let speakOutput = 'Bienvenidos y bienvenidas a la oca. Para empezar una partida, di "Nueva partida"';
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
        let njugadores = 0;

        // Verifica si el slot 'numJugadores' está presente y tiene un valor
        if (intent.confirmationStatus === 'CONFIRMED'){
            njugadores = Alexa.getSlotValue(requestEnvelope, 'numJugadores');
            sessionAttributes.numJugadores = njugadores;
            
            jugadores = crearJugadores(njugadores);
            for (let i = 0; i < njugadores; i++){
                penalizaciones[i] = 0;
            }
            
            speakOutput += `Estos son los ${njugadores} jugadores que van a participar: `;
            jugadores.forEach(jugador => {
                speakOutput += (`Jugador ${jugador.id + 1}, representado por el color ${jugador.color}. `);
            });
            
            speakOutput += `<break time="3s"/> Bien, si los ${njugadores} jugadores están preparados, que comience la partida.
                        Jugador rojo, proceda a tirar el dado`;
            
        
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
        let responseBuilder = handlerInput.responseBuilder;
        dado = sessionAttributes.valorDado;
        
        if (dado === undefined && penalizaciones[jugadores[turno].id] === 0){
            speakOutput = `Jugador ${jugadores[turno].color} ha tirado el dado. `
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
            speakOutput += `<break time="5s"/> Jugador ${jugadores[turno].color} ha sacado un ${dado}. Por favor proceda a mover su ficha.`;
        } else {
            let njugadores =  sessionAttributes.numJugadores;
            sessionAttributes.valorDado = undefined;
            let jActual = jugadores[turno];
            
            const [casillaNueva, informe, finPartida, dobleTurno] = avanzaJugador(jActual, dado, tablero, jugadores, penalizaciones);
            speakOutput += informe;
            
            const jugEnCasilla = getJugadoresCasilla(jActual.getPosActual(), jActual, jugadores);
            
            if (!finPartida) {
                if (dobleTurno){
                    speakOutput += `<break time="5s"/> Vuelve a ser el turno del jugador ${jugadores[turno].color}. Por favor tire el dado de nuevo. `;
                } else {
                    turno = pasarTurno(turno, njugadores);
                    speakOutput += `<break time="5s"/> Ahora es el turno del jugador ${jugadores[turno].color}. Por favor tire el dado. `;
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
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

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