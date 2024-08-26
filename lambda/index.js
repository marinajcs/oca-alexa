/**
 * Este módulo actúa como el entry point de la skill de Alexa. 
 * Configura los manejadores (handlers) para los distintos intents y eventos de la skill.
 *
 * @module index
 */

const Alexa = require('ask-sdk-core');
const {
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
    preguntasCompasHandler,
    preguntasCasillaHandler,
    preguntasFechasHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
    ErrorHandler
} = require('./handlers');

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        configuracion1Handler,
        guardarPartidaHandler,
        cargarPartidaHandler,
        HelpIntentHandler,
        ayudaReglasHandler,
        nuevaPartidaHandler,
        addJugadorHandler,
        jugarTurnoHandler,
        preguntasVyFHandler,
        preguntasCifrasHandler,
        preguntasCasillaHandler,
        preguntasCompasHandler,
        preguntasFechasHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
