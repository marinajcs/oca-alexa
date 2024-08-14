const Alexa = require('ask-sdk-core');
const {
    LaunchRequestHandler,
    configuracion1Handler,
    ayudaReglasHandler,
    numJugadoresHandler,
    addJugadorHandler,
    tirarDadoHandler,
    preguntasVyFHandler,
    preguntasFechasHandler,
    preguntasCompasHandler,
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
